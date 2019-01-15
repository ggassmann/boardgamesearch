import * as React from 'react';
import Helmet from 'react-helmet';
import { FETCH_STATUS_SUCCESS, useFetch } from 'src/frontend/lib/useFetch';
import { log } from 'src/lib/log';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';

export default ({ id, finalizeLoadable }: IProductPageProps) => {
  const [
    googleSignInURL, googleSignInURLState,
  ] = useFetch(`${host}:${userPort}${userOriginPath}auth/google/signinurl`, { fields: {} });
  return (
    <div>
      <h1>test</h1>
      {googleSignInURLState === FETCH_STATUS_SUCCESS &&
        <a href={googleSignInURL.url}>Sign in with Google</a>
      }
    </div>
  );
};
