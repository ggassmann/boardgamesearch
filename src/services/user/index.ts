import '@babel/polyfill';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as core from 'express-serve-static-core';
import fetch from 'node-fetch';
import { log } from 'src/lib/log';
import { userOriginPath } from 'src/services/serviceorigins';
import {init as initGoogle} from './auth/google';

const app: core.Express = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));
initGoogle(app);

app.listen(CFG.USER_PORT, () => log(`User Service Listening on ${CFG.USER_PORT}`));
