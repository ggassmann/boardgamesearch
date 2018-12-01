import 'reflect-metadata';

import * as accounting from 'accounting';
import Bottleneck from 'bottleneck';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import * as puppeteer from 'puppeteer';
import { IThing } from 'src/lib/IThing';
import { error, log } from 'src/lib/log';
import { origin as solrOrigin } from 'src/services/solr';
import { con } from '../database';
import { ScrapeProgress, ScrapeStatus } from '../entities/ScrapeProgress';

const refLink = [
  'ref=as_li_ss_tl?ie=UTF8',
  'linkCode=ll1',
  'tag=bgsearch02-20',
  'linkId=766fe3e9fae54566f7dcff23da189da3',
  'language=en_US',
].join('&');

const amazonScrapeLimiter = new Bottleneck({
  maxConcurrent: 2,
  minTime: 2000,
});
const solrLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 5000,
});

interface IAmazonThing {
  price?: number;
  link?: string;
  id: number;
}

(async () => {
  async function submitSolrItem(thing: IAmazonThing): Promise<any> {
    try {
      const updateResponse = await fetch(`${solrOrigin}amazon/update/json/docs`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([thing]),
      });
      const updateData = await updateResponse.json();
      const commitResponse = await fetch(`${solrOrigin}amazon/update`, {
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

      const sp = new ScrapeProgress();
      sp.index = thing.id;
      sp.name = 'amazon',
      sp.status = ScrapeStatus.finished;
      (await con()).manager.save(sp);

      log(`SOLR Bottleneck: ${solrLimiter.counts().QUEUED}`);
    } catch (e) {
      log(e);
      return solrLimiter.schedule(async () => await submitSolrItem(thing));
    }
  }

  const getThingByID = async (id: number): Promise<IThing> => {
    const solrQuery = [
      `${solrOrigin}boardgame/select?`,
      [
        `q=id:${id}`,
        'fl=*',
      ].join('&'),
    ].join('');
    try {
      const response = await fetch(solrQuery);
      const responseJson = await response.json();
      if (responseJson.error) {
        throw responseJson.error;
      }
      return responseJson.response.docs[0];
    } catch (e) {
      log(e);
      return null;
    }
  };
  const getAmazonSearchURLFromThing = (thing: IThing): string => {
    return `https://www.amazon.com/s?url=search-alias%3Dtoys-and-games&field-keywords=${thing.name}+game`;
  };

  const processThing = async (id: number): Promise<number> => {
    const browserPagePromise = browser.newPage();
    const thing = await getThingByID(id);
    if (!thing) {
      return;
    }
    const amazonSearchURL = getAmazonSearchURLFromThing(thing);

    const browserPage = await browserPagePromise;

    await browserPage.goto(amazonSearchURL);
    const searchContent = cheerio.load(await browserPage.content());
    if (searchContent('#noResultsTitle').text().length > 0) {
      const sp = new ScrapeProgress();
      sp.index = thing.id;
      sp.name = 'amazon',
      sp.status = ScrapeStatus.doesNotExist;
      (await con()).manager.save(sp);
      return;
    }
    try {
      const searchResultURL = searchContent('#result_0 > div > div:nth-child(5) > div:nth-child(1) > a').attr('href');
      const absoluteSearchResultURL = searchResultURL.startsWith('/') ? (
        `https://www.amazon.com${searchResultURL}`
      ) : (
        searchResultURL
      );

      await browserPage.goto(absoluteSearchResultURL);
      const searchResultContent = cheerio.load(await browserPage.content());
      const price = accounting.unformat(searchResultContent('#priceblock_ourprice').text());
      const link = `${absoluteSearchResultURL}&${refLink}`;

      log(thing.name, price);
      submitSolrItem({
        id: thing.id,
        price,
        link,
      });

      setTimeout(() => {
        try {
          browserPage.close();
        } catch (e) {
          log('Failed to close page');
        }
      }, 25);
    } catch (e) {
      log(`Error reaching ${thing.name}`);
      const sp = new ScrapeProgress();
      sp.index = thing.id;
      sp.name = 'amazon',
      sp.status = ScrapeStatus.errorOccured;
      (await con()).manager.save(sp);
      error(e.message);
    }
  };

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  });
  const lastProgress =
    (await (await con())
      .getRepository(ScrapeProgress)
      .createQueryBuilder('scrape_progress')
      .where("scrape_progress.name = 'amazon'")
      .take(1)
      .orderBy('scrape_progress.index', 'DESC')
      .getOne()
    );
  for (let i = lastProgress && lastProgress.index || 0; i < 600000; i++) {
    const matchingScrapeProgress = (await (await con())
      .getRepository(ScrapeProgress)
      .createQueryBuilder('scrape_progress')
      .where("scrape_progress.name = 'amazon'")
      .andWhere(`scrape_progress.index = ${i}`)
      .getOne()
    );
    if (!matchingScrapeProgress) {
      amazonScrapeLimiter.schedule(() => processThing(i));
    } else {
      log('Skipping', i);
    }
  }
})();
