import * as core from 'express-serve-static-core';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { log } from 'src/lib/log';
import { con } from 'src/services/database';
import { User } from 'src/services/entities/User';
import { UserSession } from 'src/services/entities/UserSession';
import { userAuthGoogleRedirectURI } from 'src/services/serviceorigins';
import * as uuidv5 from 'uuid/v5';

const GOOGLE_UUID_NAMESPACE = '630eb68f-e0fa-5ecc-887a-7c7a62614681';

const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
  'profile',
];

function createConnection() {
  return new google.auth.OAuth2(
    CFG.GOOGLE_AUTH.client_id,
    CFG.GOOGLE_AUTH.client_secret,
    userAuthGoogleRedirectURI,
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
    const people = google.people({ version: 'v1', auth });
    const peopleResponse = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos',
    });
    const avatar = peopleResponse.data.photos[0].url;
    const name = peopleResponse.data.names[0].displayName;
    const email = peopleResponse.data.emailAddresses[0].value;
    const oauthName = `google/${peopleResponse.data.resourceName.replace('people/', '')}`;

    const generatedUser = new User();
    generatedUser.avatar = avatar;
    generatedUser.email = email;
    generatedUser.displayName = name;
    generatedUser.oauthName = oauthName;

    const getUser = async () => {
      return await (await con())
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.oauthName = :oauthName', generatedUser)
        .getOne();
    };

    let currentUser = await getUser();

    if (!currentUser) {
      await (await con()).createQueryBuilder()
        .insert()
        .into(User)
        .values(generatedUser)
        .execute();
      currentUser = await getUser();
    }

    const sessionKey = uuidv5(currentUser.oauthName + process.hrtime()[1], GOOGLE_UUID_NAMESPACE);

    const newSession = new UserSession();
    newSession.user = currentUser;
    newSession.sessionKey = sessionKey;
    (await con()).createQueryBuilder()
      .insert()
      .into(UserSession)
      .values(newSession)
      .execute();

    res.send({
      sessionKey,
    });
  });
};
