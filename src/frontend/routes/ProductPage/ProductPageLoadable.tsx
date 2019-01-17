import { loadable } from 'src/frontend/lib/loadable';

export const ProductPageLoadable = loadable(
  () => import(/* webpackChunkName: "product-page" */'./ProductPage'),
);
