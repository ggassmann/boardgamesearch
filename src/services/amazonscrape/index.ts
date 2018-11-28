import * as accounting from 'accounting';
import Bottleneck from 'bottleneck';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import * as puppeteer from 'puppeteer';
import { IThing } from 'src/lib/IThing';
import { error, log } from 'src/lib/log';
import { origin as solrOrigin } from 'src/services/solr';

const amazonScrapeLimiter = new Bottleneck({
  maxConcurrent: 2,
  minTime: 2500,
});
const solrLimiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 5000,
});

interface IAmazonThing {
  price?: number;
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
          optimize: { waitSearcher: false },
        }),
      });
      const commitData = await commitResponse.json();
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
      log('Found no results for', thing.name);
      return;
    }
    const searchResultURL = searchContent('#result_0 > div > div:nth-child(5) > div:nth-child(1) > a').attr('href');
    const absoluteSearchResultURL = searchResultURL.startsWith('/') ? (
      `https://www.amazon.com${searchResultURL}`
    ) : (
      searchResultURL
    );

    try {
      await browserPage.goto(absoluteSearchResultURL);
      const searchResultContent = cheerio.load(await browserPage.content());
      const price = accounting.unformat(searchResultContent('#priceblock_ourprice').text());

      log(thing.name, price);
      submitSolrItem({
        id: thing.id,
        price,
      });

      return price;
    } catch (e) {
      log(`Error reaching ${searchResultURL} for ${thing.name}`);
      error(e.message);
    }
  };

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  });
  for (let i = 1; i < 50000; i++) {
    amazonScrapeLimiter.schedule(async () => await processThing(i));
  }
})();
