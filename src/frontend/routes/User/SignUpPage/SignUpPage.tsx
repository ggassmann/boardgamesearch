import * as React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { Section } from 'src/frontend/components/Section';
import { FETCH_STATUS_SUCCESS, useFetch } from 'src/frontend/lib/useFetch';
import { log } from 'src/lib/log';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';

export default ({ id, finalizeLoadable }: IProductPageProps) => {
  const [
    googleSignInURL, googleSignInURLState,
  ] = useFetch(`${host}:${userPort}${userOriginPath}auth/google/signinurl`, { fields: {} });
  if (googleSignInURLState === FETCH_STATUS_SUCCESS) {
    finalizeLoadable();
  }
  return (
    <div>
      <Section>
        {googleSignInURLState === FETCH_STATUS_SUCCESS &&
          <a href={googleSignInURL.url}>
            <img
              src='https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png'
            />
          </a>
        }
      </Section>
    </div>
  );
};
