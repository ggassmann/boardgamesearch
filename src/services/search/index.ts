import '@babel/polyfill';
import * as cors from 'cors';
import * as express from 'express';
import fetch from 'node-fetch';
import {log} from 'src/services/log';
import {searchOriginPath, searchPort as port} from 'src/services/serviceorigins';
import {origin as solrOrigin} from 'src/services/solr';

const app = express();

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

const facets = ['categories','families','designers','publishers','mechanics','artists'];

const solrSearch = async (query: string) => {
  const solrQuery = [
    `${solrOrigin}boardgame/select?`,
    [
      'boost=sum(product(suggestedRating, 10), recip(ms(NOW,yearPublished), 3.16e-11, 1, 1))',
      'defType=edismax',
      `q=${query}`,
      'q.alt=*:*',
      'qf=_text_',
      'fq=type:boardgame',
      'fl=score,name,id,suggestedRating,thumbnail,categories',
      'facet=on',
      ...facets.map((field) => `facet.field=${field}`),
      'debugQuery=on',
    ].join('&'),
  ].join('');
  try {
    const response = await fetch(solrQuery);
    return await response.json();
  } catch (e) {
    return null;
  }
}

app.get(`${searchOriginPath}facets`, async (req, res) => {
  const solrQuery = [
    `${solrOrigin}boardgame/select?`,
    [
      `q=*.*`,
      'facet=on',
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
})
app.get(`${searchOriginPath}search/:query`, async (req, res) => {
  const data = await solrSearch(req.params.query);
  res.send({
    docs: data.response.docs,
    _solr: data,
    success: true
  });
})
app.get(`${searchOriginPath}default`, async (req, res) => {
  const data = await solrSearch('');
  res.send({
    docs: data.response.docs,
    _solr: data,
    success: true
  });
});

app.listen(port, () => log(`Example app listening on port ${port}!`));
