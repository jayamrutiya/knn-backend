import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import ENV from './env';
import { morganLogger } from './logger';
import { errorHandler } from '../middlewares/errorHandler';

// import routes
import routers from '../routes/index';

const app = express();

// Use helmet JS
app.use(helmet());

// Use body parser to read JSON payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

// Use morgan logger
app.use(morganLogger);

// Register routes
app.use('/test', routers.testRouter);
app.use(`${ENV.API_ROOT}/customers`, routers.customerRouter);
app.use(`${ENV.API_ROOT}/auth`, routers.authenticationRouter);
app.use(`${ENV.API_ROOT}/users`, routers.userRouter);
app.use(`${ENV.API_ROOT}/subscriptions`, routers.subscriptionRouter);
app.use(`${ENV.API_ROOT}/roles`, routers.rolerRouter);
app.use(`${ENV.API_ROOT}/books`, routers.bookRouter);
// Use error handling middleware
app.use(errorHandler);

// Export the configured app
export default app;
