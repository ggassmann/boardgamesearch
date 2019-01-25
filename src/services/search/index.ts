import '@babel/polyfill';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import fetch from 'node-fetch';
import { ISearchFilter } from 'src/frontend/lib/ISearchFilter';
import { IThing } from 'src/lib/IThing';
import { log } from 'src/lib/log';
import { con } from 'src/services/database';
import { searchOriginPath } from 'src/services/serviceorigins';
import { origin as solrOrigin } from 'src/services/solr';

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

const facets = ['categories', 'families', 'designers', 'publishers', 'mechanics', 'artists'];

const solrSearch = async (query: string, filters: ISearchFilter[] = []) => {
  const solrQuery = [
    `${solrOrigin}thing/select?`,
    [
      'boost=sum(product(suggestedRating, 0.5), recip(ms(NOW,datePublished), 3.16e-11, 1, 1))',
      'defType=edismax',
      `q=${query}`,
      'q.alt=*:*',
      'qf=_text_ name^15 description',
      'fq=type:boardgame',
      'fl=score,name,id,suggestedRating,thumbnail,categories,amazonPrice,amazonLink',
      'facet=on',
      'facet.limit=-1',
      ...facets.map((field) => `facet.field=${field}`),
      ...filters.map((filter) => `fq=${filter.column}:"${filter.value}"`),
      'debugQuery=on',
    ].join('&'),
  ].join('');
  try {
    const response = await fetch(solrQuery);
    const responseJson = await response.json();
    if (responseJson.error) {
      throw responseJson.error;
    }
    return responseJson;
  } catch (e) {
    log(e);
    return null;
  }
};

app.get(`${searchOriginPath}facets`, async (req, res) => {
  const solrQuery = [
    `${solrOrigin}thing/select?`,
    [
      'q=*.*',
      'facet=on',
      'facet.limit=-1',
      'rows=0',
      ...facets.map((field) => `facet.field=${field}`),
    ].join('&'),
  ].join('');
  try {
    const response = await fetch(solrQuery);
    const data = await response.json();
    res.send({
      fields: data.facet_counts.facet_fields,
    });
  } catch (e) {
    res.send(500);
  }
});

app.post(`${searchOriginPath}search`, async (req, res) => {
  const data = await solrSearch(req.body.query, req.body.filters);
  res.send({
    docs: data.response.docs,
    _solr: data,
    success: true,
  });
});

const getMoreLikeThis = async (item: IThing): Promise<IThing[]> => {
  const solrQuery = [
    `${solrOrigin}thing/select?`,
    [
      'q.alt=*.*',
      `fq=NOT _id:${item._id}`,
      'fl=id,name,thumbnail,suggestedRating',
      'defType=dismax',
      'bf=suggestedRating^15',
      ...[
        ['type', 1000],
        ['families', 14],
        ['mechanics', 13],
        ['genres', 12],
        ['themes', 10],
        ['suggestedWeight', 5],
      ].map((mltSet) => {
        let query: any = item[mltSet[0]];
        if (!query) {
          return undefined;
        }
        if (item[mltSet[0]].join) {
          log(item[mltSet[0]]);
          query = `${item[mltSet[0]].join('" OR "')}`;
        }
        return `bq=${mltSet[0]}:\"${query}\"^${mltSet[1]}`;
      }).filter((x) => !(!x)),
    ].join('&'),
  ].join('');
  log(solrQuery);
  try {
    const response = await fetch(solrQuery);
    const data = await response.json();
    return data.response.docs;
  } catch (e) {
    throw e;
  }
};

app.get(`${searchOriginPath}item/:id`, async (req, res) => {
  const solrQuery = [
    `${solrOrigin}thing/select?`,
    [
      `q=id:${req.params.id}`,
      'rows=1',
    ].join('&'),
  ].join('');
  try {
    const response = await fetch(solrQuery);
    const data = await response.json();
    const item = data.response.docs[0];
    res.send({
      item,
      relatedItems: await getMoreLikeThis(item),
    });
  } catch (e) {
    res.send(500);
    return;
  }
});

app.listen(CFG.SEARCH_PORT, () => log(`Search Service Listening on ${CFG.SEARCH_PORT}`));
