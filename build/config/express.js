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
const app = express_1.default();
// Use helmet JS
app.use(helmet_1.default());
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
// Use error handling middleware
app.use(errorHandler_1.errorHandler);
// Export the configured app
exports.default = app;
