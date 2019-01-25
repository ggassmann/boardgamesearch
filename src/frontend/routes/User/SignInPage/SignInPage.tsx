import * as React from 'react';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router';
import { Section } from 'src/frontend/components/Section';
import { ILoadablePageProps } from 'src/frontend/lib/ILoadablePageProps';
import { useCookie } from 'src/frontend/lib/useCookie';
import { FETCH_STATUS_SUCCESS, useFetch } from 'src/frontend/lib/useFetch';
import { log } from 'src/lib/log';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';
import { GoogleSignInCallback } from './callbacks/GoogleSignInCallback';

const SignInPageContent = ({ finalizeLoadable }: ILoadablePageProps) => {
  const [
    googleSignInURL, googleSignInURLState,
  ] = useFetch(`${host}:${userPort}${userOriginPath}auth/google/signinurl`, { fields: {} });
  const [sessionKey, setSessionKey] = useCookie('sessionKey');

  if (googleSignInURLState === FETCH_STATUS_SUCCESS) {
    finalizeLoadable();
  }

  return (
    <Section>
      {googleSignInURLState === FETCH_STATUS_SUCCESS &&
        <a href={googleSignInURL.url} onClick={() => setSessionKey(undefined)}>
          <img
            src='https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png'
          />
        </a>
      }
    </Section>
  );
};

export default ({ finalizeLoadable }: ILoadablePageProps) => {
  return (
    <div>
      <Switch>
        <Route
          exact={true}
          path='/user/signin'
          render={() => (
            <SignInPageContent finalizeLoadable={finalizeLoadable}/>
          )}
        />
        <Route
          exact={true}
          path='/user/signin/google/callback'
          render={() => (
            <GoogleSignInCallback/>
          )}
        />
      </Switch>
    </div>
  );
};
