import 'source-map-support/register';

import '@babel/polyfill';
import Bottleneck from 'bottleneck';
import * as he from 'he';
import * as _ from 'lodash';
import * as moment from 'moment';
import fetch from 'node-fetch';
import * as util from 'util';
import * as xml2jslib from 'xml2js';

import {log} from 'src/services/log';
import {IThing} from '../IThing';
import {origin as solrOrigin} from '../solr';
import {IBGGScrapeResults} from './bggapitypes';

const xml2js = util.promisify(xml2jslib.parseString);

const bggLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1250,
});
const solrLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 10000,
});
const thingsPerRequest = 150;

interface IPollValueMap {
  [key: string]: number;
}

const pollValueMap: IPollValueMap = {
  'Best': 4,
  'Recommended': 2,
  'Not Recommended': -4,
};

let solrQueue: any[] = [];
let totalDocumentsSubmitted = 0;

const enqueueThing = (item: any) => {
  solrQueue = [
    ...solrQueue,
    item,
  ];
};
const popThing = () => {
  const popped = solrQueue[0];
  solrQueue = solrQueue.slice(1);
  return popped;
};

setInterval(async () => {
  let things: any = [];
  while (things.length < 10 && solrQueue.length > 0) {
    things = [
      ...things,
      popThing(),
    ];
  }
  if (things.length < 1) {
    return;
  }
  async function submitSolrItem(): Promise<any> {
    try {
      const updateResponse = await fetch(`${solrOrigin}boardgame/update/json/docs`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(things),
      });
      const updateData = await updateResponse.json();
      const commitResponse = await fetch(`${solrOrigin}boardgame/update`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commit: {},
          optimize: { waitSearcher: false },
        }),
      });
      const commitData = await commitResponse.json();
      totalDocumentsSubmitted += things.length;
      log(`SOLR Queue Length: ${solrQueue.length}`);
      log(`Scrape Bottleneck: ${bggLimiter.counts().QUEUED}`);
      log(`SOLR Bottleneck: ${solrLimiter.counts().QUEUED}`);
      log(`Total Documents: ${totalDocumentsSubmitted}`);
    } catch (e) {
      log(e);
      return solrLimiter.schedule(submitSolrItem);
    }
  }
  await solrLimiter.schedule(submitSolrItem);
}, 250);

for (let i = 0; i < 10000000; i += thingsPerRequest) {
  async function enqueue(originId: number) {
    const ids: number[] = [];
    for (let j = originId; j < originId + thingsPerRequest; j++) {
      ids.push(j);
    }
    const data: IBGGScrapeResults = await bggLimiter.schedule(
      async () => {
        await new Promise((resolve) => {
          const solrWaitInterval = setInterval(() => {
            if (solrLimiter.counts().QUEUED <= 5) {
              resolve();
              clearInterval(solrWaitInterval);
            }
          }, 500);
        });
        const results = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${ids.join(',')}&stats=1`);
        const resultsText = await results.text();
        const resultsJson = await xml2js(resultsText);
        return resultsJson;
      },
    );
    if (data.error && data.error.message && data.error.message[0] === 'Rate limit exceeded.') {
      enqueue(originId);
      return;
    }
    if (!data.items.item) {
      return;
    }
    data.items.item.forEach((bggThing) => {
      const links = bggThing.link && bggThing.link.map((link) => link.$) || [];
      const numYearPublished = Math.max(
        0,
        bggThing.yearpublished && bggThing.yearpublished.map((yp) => parseInt(yp.$.value, 10))[0]
      );
      const formattedYear = `${numYearPublished<1000 && '0' || ''}${numYearPublished<100 && '0' || ''}${numYearPublished<10 && '0' || ''}${numYearPublished}`;
      const year = moment(
        `${formattedYear}-01-01`,
      ).format('YYYY-MM-DDThh:mm:ss') + 'Z';
      let thing: IThing = {
        type: bggThing.$.type,
        id: parseInt(bggThing.$.id, 10),
        thumbnail: bggThing.thumbnail ? bggThing.thumbnail[0] : '',
        image: bggThing.image ? bggThing.image[0] : '',
        name: bggThing.name &&
          bggThing.name.map((name) => name.$).filter((name) => name.type === 'primary')[0].value || undefined,
        description: bggThing.description && he.decode(bggThing.description[0]) || undefined,
        strict_date_published:
          bggThing.yearpublished &&
          !isNaN(bggThing.yearpublished.map((yp) => parseInt(yp.$.value, 10))[0]) &&
          `${bggThing.yearpublished.map((yp) => parseInt(yp.$.value, 10))[0]}/01/01` || undefined,
        yearPublished: year,
        minPlayers: bggThing.minplayers && parseInt(bggThing.minplayers.map((mp) => mp.$.value)[0], 10) || undefined,
        maxPlayers: bggThing.maxplayers && parseInt(bggThing.maxplayers.map((mp) => mp.$.value)[0], 10) || undefined,
        playingTime: bggThing.playingtime && parseInt(bggThing.playingtime.map((pt) => pt.$.value)[0], 10) || undefined,
        minPlayTime: bggThing.minplaytime && parseInt(bggThing.minplaytime.map((pt) => pt.$.value)[0], 10) || undefined,
        maxPlayTime: bggThing.maxplaytime && parseInt(bggThing.maxplaytime.map((pt) => pt.$.value)[0], 10) || undefined,
        minAge: bggThing.minage && parseInt(bggThing.minage.map((age) => age.$.value)[0], 10) || undefined,
        categories: links.filter((link) => link.type.endsWith('category')).map((link) => link.value),
        mechanics: links.filter((link) => link.type.endsWith('mechanic')).map((link) => link.value),
        families: links.filter((link) => link.type.endsWith('family')).map((link) => link.value),
        expansions: links.filter((link) => link.type.endsWith('expansion')).map((link) => link.value),
        designers: links.filter((link) => link.type.endsWith('designer')).map((link) => link.value),
        artists: links.filter((link) => link.type.endsWith('artist')).map((link) => link.value),
        publishers: links.filter((link) => link.type.endsWith('publisher')).map((link) => link.value),
        producers: links.filter((link) => link.type.endsWith('producer')).map((link) => link.value),
        genres: links.filter((link) => link.type.endsWith('genre')).map((link) => link.value),
        integrations: links.filter((link) => link.type.endsWith('integration')).map((link) => link.value),
        accessories: links.filter((link) => link.type.endsWith('accessory')).map((link) => link.value),
        compilations: links.filter((link) => link.type.endsWith('compilation')).map((link) => link.value),
        serieses: links.filter((link) => link.type.endsWith('series')).map((link) => link.value),
        franchises: links.filter((link) => link.type.endsWith('franchise')).map((link) => link.value),
        platforms: links.filter((link) => link.type.endsWith('platforms')).map((link) => link.value),
        themes: links.filter((link) => link.type.endsWith('theme')).map((link) => link.value),
        modes: links.filter((link) => link.type.endsWith('mode')).map((link) => link.value),
        issues: links.filter((link) => link.type.endsWith('issue')).map((link) => link.value),
        suggestedRating: undefined,
        suggestedWeight: undefined,
      };
      if (bggThing.poll) {
        const pollResults = bggThing.poll
          .map((pollItem) => {
            if (parseInt(pollItem.$.totalvotes, 10) < 5) { // Ignore polls with fewer than 5 votes
              return;
            }
            let key;
            let value;
            if (pollItem.$.name === 'suggested_numplayers') {
              key = 'suggestedPlayers';
              try {
                value = parseInt(
                  pollItem.results
                    .map((pollResultItem) => ({
                      playerCount: pollResultItem.$.numplayers,
                      result: pollResultItem.result
                        .reduce(
                          (v, pollResultItemVoteData) =>
                            v + pollValueMap[pollResultItemVoteData.$.value] * pollResultItemVoteData.$.numvotes,
                          0,
                        ),
                    }))
                    .sort((a, b) => b.result - a.result)
                    [0].playerCount,
                    10,
                );
              } catch (e) {
                return;
              }
            } else if (pollItem.$.name === 'suggested_playerage') {
              key = 'suggestedMinPlayerAge';
              value = parseInt(
                pollItem.results[0].result
                  .map((playerAge) => playerAge.$)
                  .sort((a, b) => b.numvotes - a.numvotes)
                  [0].value,
                10,
              );
            } else if (pollItem.$.name === 'language_dependence') {
              key = 'suggestedLanguageDependence';
              value = pollItem.results[0].result
                .map((pi) => pi.$)
                .sort((a, b) => b.numvotes - a.numvotes)
                [0].value;
            }
            return {
              key,
              value,
            };
          });
        const finalPollResults =
          pollResults.reduce((obj, r) => !r ? obj : Object.assign({}, obj, {[r.key]: r.value}), {});
        thing = Object.assign(
          {},
          thing,
          finalPollResults,
        );
      }
      if (bggThing.statistics) {
        thing.suggestedRating =
          Math.round(parseFloat(bggThing.statistics[0].ratings[0].bayesaverage[0].$.value) * 100) / 100;
        thing.suggestedWeight =
          Math.round(parseFloat(bggThing.statistics[0].ratings[0].averageweight[0].$.value) * 100) / 100;
        thing.suggestedRating = thing.suggestedRating === 0 ? undefined : thing.suggestedRating;
        thing.suggestedWeight = thing.suggestedWeight === 0 ? undefined : thing.suggestedWeight;
      }
      enqueueThing(thing);
    });
  }
  enqueue(i + 1);
}
