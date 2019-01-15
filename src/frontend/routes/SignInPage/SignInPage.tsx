import * as React from 'react';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router';
import { FETCH_STATUS_SUCCESS, useFetch } from 'src/frontend/lib/useFetch';
import { log } from 'src/lib/log';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';
import { GoogleSignInCallback } from './callbacks/GoogleSignInCallback';

export default ({ id, finalizeLoadable }: IProductPageProps) => {
  const [
    googleSignInURL, googleSignInURLState,
  ] = useFetch(`${host}:${userPort}${userOriginPath}auth/google/signinurl`, { fields: {} });
  return (
    <div>
      <Switch>
        <Route
          exact={true}
          path='/user/signin/google/callback'
          render={() => (
            <GoogleSignInCallback />
          )}
        />
      </Switch>
    </div>
  );
};
