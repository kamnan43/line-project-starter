import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { router as webhookRouter } from './webhook';

const app = express();

const jsonParser = bodyParser.json({ limit: '25mb' });
const urlencode = bodyParser.urlencoded({ extended: true });
const middleware = [
    jsonParser,
    urlencode,
];

app.use('/webhook', middleware, webhookRouter);

export const api = functions.https.onRequest(app);
