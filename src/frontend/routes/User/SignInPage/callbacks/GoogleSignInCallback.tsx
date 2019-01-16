import { parse as parseQS } from 'qs';
import * as React from 'react';
import { Redirect } from 'react-router';
import { useCookie } from 'src/frontend/lib/useCookie';
import { FETCH_STATUS_SUCCESS, useFetch } from 'src/frontend/lib/useFetch';
import { GlobalStoreInstance } from 'src/frontend/stores/GlobalStore';
import { log } from 'src/lib/log';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';

interface IGoogleSignInCallbackProps {
  finalizeLoadable: () => void;
}

export const GoogleSignInCallback = () => {
  const query = parseQS(window.location.search.substr(1));
  const code = query.code;

  const globalStore = GlobalStoreInstance.useStore();

  const [codeResponse, codeResponseState] = useFetch(
    `${host}:${userPort}${userOriginPath}auth/google/validate/${encodeURIComponent(code)}`,
    undefined,
  );
  const [sessionKey, setSessionKey] = useCookie('sessionKey');
  log('Rendered sign in callback', sessionKey, codeResponse);
  if (codeResponseState === FETCH_STATUS_SUCCESS && sessionKey !== codeResponse.sessionKey) {
    setSessionKey(codeResponse.sessionKey);
  }
  const loggedIn = sessionKey && codeResponse && codeResponse.sessionKey === sessionKey;
  return (
    <div>
      {loggedIn &&
        <Redirect to='/user/account'/>
      }
    </div>
  );
};
