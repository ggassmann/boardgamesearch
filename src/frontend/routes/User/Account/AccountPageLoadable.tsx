import { loadable } from 'src/frontend/lib/loadable';

export const AccountPageLoadable = loadable(
  () => import(/* webpackChunkName: "user-account-page" */'./AccountPage'),
);
