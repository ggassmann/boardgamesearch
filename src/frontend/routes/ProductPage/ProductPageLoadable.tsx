import * as React from 'react';
import * as Loadable from 'react-loadable';
import { CircularProgress } from '@material-ui/core';

export const ProductPageLoadable = Loadable({
  loader: () => import('./ProductPage'),
  loading: () => <CircularProgress />,
})