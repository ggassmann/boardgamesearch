import * as core from 'express-serve-static-core';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { log } from 'src/lib/log';

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
];

function createConnection() {
  return new google.auth.OAuth2(
    CFG.GOOGLE_AUTH.client_id,
    CFG.GOOGLE_AUTH.client_secret,
    CFG.GOOGLE_AUTH.redirect_uris[1],
  );
}

function getConnectionUrl(auth: OAuth2Client) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
    scope: defaultScope,
  });
}

function urlGoogle() {
  const auth = createConnection(); // this is from previous step
  const url = getConnectionUrl(auth);
  return url;
}

export const init = (app: core.Express) => {
  app.get(`${CFG.USER_ORIGIN_PATH}auth/google/signinurl`, (req, res) => {
    res.send({ success: true, url: urlGoogle() });
  });
  app.get(`${CFG.USER_ORIGIN_PATH}auth/google/validate/:code`, async (req, res) => {
    const tokenResponse = await createConnection().getToken(req.params.code);
    const tokens = tokenResponse.tokens;

    const auth = createConnection();
    auth.setCredentials(tokens);
    const plus = google.plus('v1');
    log(await plus.people.get({ userId: 'me', auth }));

    res.send({ token: tokens });
  });
};
