"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = __importDefault(require("./env"));
const logger_1 = require("./logger");
const errorHandler_1 = require("../middlewares/errorHandler");
// import routes
const index_1 = __importDefault(require("../routes/index"));
const cors_1 = __importDefault(require("./cors"));
const events_1 = require("./events");
const subscribers_1 = __importDefault(require("../subscribers"));
const app = express_1.default();
// Use helmet JS
app.use(helmet_1.default());
app.use(cors_1.default);
// Use body parser to read JSON payloads
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use(body_parser_1.default.json());
// Use morgan logger
app.use(logger_1.morganLogger);
// Register routes
app.use('/test', index_1.default.testRouter);
app.use(`${env_1.default.API_ROOT}/customers`, index_1.default.customerRouter);
app.use(`${env_1.default.API_ROOT}/auth`, index_1.default.authenticationRouter);
app.use(`${env_1.default.API_ROOT}/users`, index_1.default.userRouter);
app.use(`${env_1.default.API_ROOT}/subscriptions`, index_1.default.subscriptionRouter);
app.use(`${env_1.default.API_ROOT}/roles`, index_1.default.rolerRouter);
app.use(`${env_1.default.API_ROOT}/books`, index_1.default.bookRouter);
app.use(`${env_1.default.API_ROOT}/events`, index_1.default.eventRouter);
app.use(`${env_1.default.API_ROOT}/blogs`, index_1.default.blogRouter);
app.use(`${env_1.default.API_ROOT}/discussions`, index_1.default.discussionRouter);
app.use(`${env_1.default.API_ROOT}/categories`, index_1.default.categoryRouter);
// Use error handling middleware
app.use(errorHandler_1.errorHandler);
app.on(events_1.EventTypes.SEND_RESET_PASSWORD_EMAIL, subscribers_1.default.sendResetPasswordEmail);
app.on(events_1.EventTypes.SEND_EVENT_REGISTRATION, subscribers_1.default.sendEventRegistrationEmail);
app.on(events_1.EventTypes.SEND_COMMON_EMAIL, subscribers_1.default.sendCommonEmail);
// Export the configured app
exports.default = app;
