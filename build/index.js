"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./config/express"));
const env_1 = __importDefault(require("./config/env"));
const container_1 = require("./config/container");
const types_1 = require("./config/types");
// Start Express server
express_1.default.listen(env_1.default.PORT, () => {
    const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
    loggerService
        .getLogger()
        .info(`⚡️[server]: Server is running at http://localhost:${env_1.default.PORT}`);
    loggerService
        .getLogger()
        .info(`⚡️[server]: API ROOT: http://localhost:${env_1.default.PORT}${env_1.default.API_ROOT}`);
});
