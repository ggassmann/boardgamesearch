import * as React from 'react';
import * as Loadable from 'react-loadable';
import { SquarePageLoader } from 'src/frontend/components/SquareLoader';

export const ProductPageLoadable = Loadable({
  loader: () => import('./ProductPage'),
  loading: () => <SquarePageLoader/>,
});
