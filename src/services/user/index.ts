import '@babel/polyfill';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as core from 'express-serve-static-core';
import fetch from 'node-fetch';
import { log } from 'src/lib/log';
import { userOriginPath } from 'src/services/serviceorigins';
import { authMiddleware } from './auth/authMiddleware';
import {init as initGoogle} from './auth/google';

const app: core.Express = express();

app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
app.use(bodyParser.json());
app.use(cookieParser(undefined, {decode: (x) => {
  x = decodeURIComponent(x);
  x = x.substring(1, x.length - 2);
  return x;
}}));

app.get('/', (req, res) => res.send('Hello World!'));
initGoogle(app);

app.get(`${userOriginPath}account`, authMiddleware(async (req, res) => {
  const user = {
    displayName: req.session.user.displayName,
    avatar: req.session.user.avatar,
  };
  res.send({success: true, user});
}));

app.listen(CFG.USER_PORT, () => log(`User Service Listening on ${CFG.USER_PORT}`));
