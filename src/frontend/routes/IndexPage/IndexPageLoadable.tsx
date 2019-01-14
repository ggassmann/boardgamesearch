import * as React from 'react';
import { SquarePageLoader } from 'src/frontend/components/SquareLoader';
import { loadable } from 'src/frontend/lib/loadable';

export const IndexPageLoadable = loadable(
  () => import(/* webpackChunkName: "index-page" */'./IndexPage'),
);
