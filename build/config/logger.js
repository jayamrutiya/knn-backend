"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganLogger = exports.LoggerService = void 0;
// Load logging library
const morgan_1 = __importDefault(require("morgan"));
const inversify_1 = require("inversify");
const winston_1 = require("winston");
const env_1 = __importDefault(require("./env"));
const { combine, timestamp, printf } = winston_1.format;
// eslint-disable-next-line @typescript-eslint/no-shadow
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
// instantiate a new Winston logger with the settings defined above
let LoggerService = class LoggerService {
    constructor() {
        // define the custom settings for each transport(file, console)
        const options = {
            file_error: {
                level: 'error',
                filename: `${env_1.default.APP_ROOT}/logs/error.log`,
                handleExceptions: true,
                json: true,
                maxsize: 5242880,
                maxFiles: 5,
                colorize: false,
                format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
            },
            file_combined: {
                filename: `${env_1.default.APP_ROOT}/logs/combined.log`,
                handleExceptions: true,
                json: true,
                maxsize: 5242880,
                maxFiles: 5,
                colorize: false,
                format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
            },
            console: {
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true,
                format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
            },
        };
        this._logger = winston_1.createLogger({
            transports: [new winston_1.transports.File(options.file_error), new winston_1.transports.File(options.file_combined)],
            exitOnError: false,
        });
        // add console logs only if not in production environment
        if (env_1.default.NODE_ENV !== 'production') {
            this._logger.add(new winston_1.transports.Console(options.console));
        }
    }
    getLogger() {
        return this._logger;
    }
};
LoggerService = __decorate([
    inversify_1.injectable()
], LoggerService);
exports.LoggerService = LoggerService;
// create a stream object with a 'write' function that will be used by 'morgan'
// Configure morgan
const morganOption = {
    stream: {
        write: (message) => new LoggerService().getLogger().info(message.trim()),
    },
};
// export configured morgan
exports.morganLogger = morgan_1.default('combined', morganOption);
