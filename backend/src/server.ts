import {
    Request,
    Response as ExResponse,
    NextFunction,
    RequestHandler,
} from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';

import { getVersion, isProd, Response } from './utils.js';
import { loadDatabaseDriver } from './repo/Driver.js';
import { loadTransporter, jwtKey } from './service/auth.js';

import AuthRouter from './routers/AuthRouter.js';
import UserRouter from './routers/UserRouter.js';
import ProjectRouter from './routers/ProjectRouter.js';
import RequestRouter from './routers/RequestRouter.js';
import userInjection from './middleware/userInjection.js';

config()

const app = express()

app.use(
    cors({
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser(process.env.SIGNING_KEY || 'example-signing-key'));

let driver = loadDatabaseDriver()
let transporter = loadTransporter()
let key = jwtKey()

app.locals.driver = driver;
app.locals.transporter = transporter;
app.locals.key = key;

app.use(AuthRouter);
app.use(userInjection);
app.use(UserRouter);
app.use(ProjectRouter);
app.use(RequestRouter);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (req: Request, res: Response) =>
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
);

if (isProd()) {
    console.info('[PROD] Codennect web launching...');
} else {
    console.info('[DEV] Codennect web launching...');
}
console.info('Running on version ' + getVersion());

app.listen(5001, () => console.log('Listening on 5001'));
