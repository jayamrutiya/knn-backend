import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import ENV from './env';
import { morganLogger } from './logger';
import { errorHandler } from '../middlewares/errorHandler';

// import routes
import routers from '../routes/index';
import cors from './cors';
import { EventTypes } from './events';
import subscribers from '../subscribers';

const app = express();

// Use helmet JS
app.use(helmet());

app.use(cors);

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
app.use(`${ENV.API_ROOT}/events`, routers.eventRouter);
app.use(`${ENV.API_ROOT}/blogs`, routers.blogRouter);
app.use(`${ENV.API_ROOT}/discussions`, routers.discussionRouter);
app.use(`${ENV.API_ROOT}/categories`, routers.categoryRouter);

// Use error handling middleware
app.use(errorHandler);

app.on(
  EventTypes.SEND_RESET_PASSWORD_EMAIL,
  subscribers.sendResetPasswordEmail,
);
app.on(
  EventTypes.SEND_EVENT_REGISTRATION,
  subscribers.sendEventRegistrationEmail,
);
app.on(EventTypes.SEND_COMMON_EMAIL, subscribers.sendCommonEmail);

// Export the configured app
export default app;
