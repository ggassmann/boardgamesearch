import { parse as parseQuerystring } from 'qs';
import * as React from 'react';
import { useFetch } from 'src/frontend/lib/useFetch';
import { host, userOriginPath, userPort } from 'src/services/serviceorigins';

export const GoogleSignInCallback = () => {
  const query = parseQuerystring(window.location.search.substr(1));
  const code = query.code;

  const [codeResponse, codeResponseState] = useFetch(
    `${host}:${userPort}${userOriginPath}auth/google/validate/${encodeURIComponent(code)}`,
    undefined,
  );
  return (
    <div>
      Signing you in with google...
      {JSON.stringify(codeResponse)}
    </div>
  );
};
