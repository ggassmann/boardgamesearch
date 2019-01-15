import { parse as parseQuerystring } from 'qs';
import * as React from 'react';
import { useCookie } from 'src/frontend/lib/useCookie';
import { FETCH_STATUS_SUCCESS, useFetch } from 'src/frontend/lib/useFetch';
import { log } from 'src/lib/log';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';

export const GoogleSignInCallback = () => {
  const query = parseQuerystring(window.location.search.substr(1));
  const code = query.code;

  const [codeResponse, codeResponseState] = useFetch(
    `${host}:${userPort}${userOriginPath}auth/google/validate/${encodeURIComponent(code)}`,
    undefined,
  );
  const [sessionKey, setSessionKey] = useCookie('sessionKey');
  if (codeResponseState === FETCH_STATUS_SUCCESS && sessionKey !== codeResponse.sessionKey) {
    setSessionKey(codeResponse.sessionKey);
  }
  return (
    <div>
      Signing you in with google...{' '}
      {codeResponseState === FETCH_STATUS_SUCCESS &&
        'Success!'
      }
    </div>
  );
};
