import 'reflect-metadata';

import Bottleneck from 'bottleneck';
import fetch from 'node-fetch';

import { IThing } from 'src/lib/IThing';
import { log } from 'src/lib/log';
import { IAmazonThing } from '../amazonscrape/IAmazonThing';
import { IBGGThing } from '../boardgamegeekscrape/IBGGThing';
import { con } from '../database';
import { ScrapeProgress, ScrapeStatus } from '../entities/ScrapeProgress';
import { origin as solrOrigin } from '../solr';

(async () => {
  const getPageOfBGGThings = async (page: number): Promise<IBGGThing[]> => {
    const pageSize = 200;
    const solrQuery = [
      `${solrOrigin}boardgamegeek/select?`,
      [
        'q=id:[0 TO *]',
        `rows=${pageSize}`,
        `start=${page * pageSize}`,
        'sort=_id ASC',
      ].join('&'),
    ].join('');
    const res = await (await fetch(solrQuery)).json();
    return res.response.docs;
  };
  const getAmazonThingsByBGGId = async (ids: number[]): Promise<IAmazonThing[]> => {
    const solrQuery = [
      `${solrOrigin}amazon/select?`,
      [
        `q=(id:${ids.join(' OR id:')})`,
      ].join('&'),
    ].join('');
    const response = await fetch(solrQuery);
    const data: IAmazonThing[] = (await response.json()).response.docs;
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
        commit: {},
      }),
    });
    const commitData = await commitResponse.json();
    things.forEach(async (thing: IBGGThing) => {
      const sp = new ScrapeProgress();
      sp.index = thing.id;
      sp.name = 'thing',
      sp.status = ScrapeStatus.finished;
      (await con()).manager.save(sp);
    });
  };
  const processPage = async (page: number) => {
    const bggThings: IBGGThing[] = await getPageOfBGGThings(page);
    const bggIds = bggThings.map((bggThing) => bggThing.id);
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
    processPage(page + 1);
  };
  processPage(0);
})();
