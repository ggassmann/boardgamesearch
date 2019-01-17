import { loadable } from 'src/frontend/lib/loadable';

export const IndexPageLoadable = loadable(
  () => import(/* webpackChunkName: "index-page" */'./IndexPage'),
);
