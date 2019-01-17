import { loadable } from 'src/frontend/lib/loadable';

export const SignInPageLoadable = loadable(
  () => import(/* webpackChunkName: "sign-in-page" */'./SignInPage'),
);
