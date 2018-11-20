import * as React from 'react';
import * as Loadable from 'react-loadable';

export const ProductPageLoadable = Loadable({
  loader: () => import('./ProductPage'),
  loading: () => <div/>,
});
