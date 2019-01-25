import 'reflect-metadata';

import fetch from 'node-fetch';

import { IThing } from 'src/lib/IThing';
import { log } from 'src/lib/log';
import { IAmazonThing } from '../amazonscrape/IAmazonThing';
import { IBGGThing } from '../boardgamegeekscrape/IBGGThing';
import { con } from '../database';
import { ScrapeProgress, ScrapeStatus } from '../entities/ScrapeProgress';
import { origin as solrOrigin } from '../solr';

const PAGE_SIZE = 350;
const MAX_PAGE = Math.ceil(600000 / PAGE_SIZE);

log('Max Page', MAX_PAGE);

(async () => {
  const getPageOfBGGThings = async (page: number): Promise<IBGGThing[]> => {
    const solrQuery = [
      `${solrOrigin}boardgamegeek/select?`,
      [
        'q=id:[0 TO *]',
        `rows=${PAGE_SIZE}`,
        `start=${page * PAGE_SIZE}`,
        'sort=_id ASC',
      ].join('&'),
    ].join('');
    const res = await (await fetch(solrQuery)).json();
    return res.response.docs;
  };
  const getAmazonThingsByBGGId = async (ids: number[]): Promise<IAmazonThing[]> => {
    if (ids.length === 0) {
      return [];
    }
    const solrQuery = [
      `${solrOrigin}amazon/select?`,
      [
        `q=(id:${ids.join(' OR id:')})`,
      ].join('&'),
    ].join('');
    const response = await fetch(solrQuery);
    const responseJson = await response.json();
    if (!responseJson.response) {
      log(responseJson);
    }
    const data: IAmazonThing[] = responseJson.response.docs;
    return data;
  };
  const submitThings = async (things: IThing[]) => {
    const updateResponse = await fetch(`${solrOrigin}thing/update/json/docs`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(things),
    });
    const updateData = await updateResponse.json();
    const commitResponse = await fetch(`${solrOrigin}thing/update`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commit: {commitWithin: 1},
      }),
    });
    const commitData = await commitResponse.json();
    const newEntities: ScrapeProgress[] = [];
    things.forEach(async (thing: IBGGThing) => {
      const sp = new ScrapeProgress();
      sp.index = thing.id;
      sp.name = 'thing',
      sp.status = ScrapeStatus.finished;
      newEntities.push(sp);
    });
    /*
    (await con()).createQueryBuilder()
      .delete()
      .from(ScrapeProgress)
      .where(`index IN (${things.map((thing) => thing.id).join(',')})`)
      .execute();
    */
    log('Commited', newEntities.length, '[', newEntities[0].index, '-', newEntities[newEntities.length - 1].index, ']');
    (await con()).manager.save(newEntities);
  };
  const processPage = async (page: number) => {
    const bggThings: IBGGThing[] = await getPageOfBGGThings(page);
    let bggIds = bggThings.map((bggThing) => parseInt(bggThing.id.toString(), 10));

    log('Processing page', page);

    if (bggIds.length > 0) {
      const matchingIds = (await (await con()).manager
        .getRepository(ScrapeProgress)
        .createQueryBuilder('scrape_progress')
        .where(`scrape_progress.index IN (${bggIds.join(',')})`)
        .andWhere("scrape_progress.name = 'thing'")
        .getMany()
      ).map((scrapeProgress: ScrapeProgress) => scrapeProgress.index);

      log(matchingIds.length, bggIds.length);

      bggIds = bggIds.filter((id) => matchingIds.indexOf(id) === -1);

      log(bggIds.length);

      if (bggIds.length > 0) {
        const amazonThings = await getAmazonThingsByBGGId(bggIds);
        const things: IThing[] = bggThings.map((bggThing: IBGGThing) => {
          const matchingAmazonThings = amazonThings.filter((aThing: IAmazonThing) => aThing.id === bggThing.id);
          const amazonThing: IAmazonThing = matchingAmazonThings.length > 0 &&
            matchingAmazonThings[0] || {id: bggThing.id};

          return {
            type: bggThing.type,
            id: bggThing.id,
            thumbnail: bggThing.thumbnail,
            image: bggThing.image,
            name: bggThing.name,
            description: bggThing.description,
            datePublished: bggThing.yearPublished,
            minPlayers: bggThing.minPlayers,
            maxPlayers: bggThing.maxPlayers,
            playingTime: bggThing.playingTime,
            minPlayTime: bggThing.minPlayTime,
            maxPlayTime: bggThing.maxPlayTime,
            minAge: bggThing.minAge,
            categories: bggThing.categories,
            mechanics: bggThing.mechanics,
            families: bggThing.families,
            expansions: bggThing.expansions,
            designers: bggThing.designers,
            artists: bggThing.artists,
            publishers: bggThing.publishers,
            producers: bggThing.producers,
            genres: bggThing.genres,
            integrations: bggThing.integrations,
            accessories: bggThing.accessories,
            compilations: bggThing.compilations,
            serieses: bggThing.serieses,
            franchises: bggThing.franchises,
            platforms: bggThing.platforms,
            themes: bggThing.themes,
            modes: bggThing.modes,
            issues: bggThing.issues,
            suggestedLanguageDependence: bggThing.suggestedLanguageDependence,
            suggestedRating: bggThing.suggestedRating,
            suggestedWeight: bggThing.suggestedWeight,

            amazonPrice: amazonThing.price,
            amazonLink: amazonThing.link,
          };
        });

        await submitThings(things);
      }
      if (page >= MAX_PAGE) {
        processPage(0);
      } else {
        processPage(page + 1);
      }
    } else {
      setTimeout(() => processPage(page - 1), 5000);
    }
  };

  let startingIndex =
    Math.floor(
      (await (await con())
        .getRepository(ScrapeProgress)
        .createQueryBuilder('scrape_progress')
        .where("scrape_progress.name = 'thing'")
        .getCount()
      ) / PAGE_SIZE,
    );

  if (startingIndex > MAX_PAGE) {
    startingIndex = 0;
  }

  log(`Starting @ Page ${startingIndex}`);

  processPage(startingIndex);
})();
