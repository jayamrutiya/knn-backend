"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_root_path_1 = __importDefault(require("app-root-path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `${app_root_path_1.default}/.env` });
exports.default = {
    APP_ROOT: app_root_path_1.default.path,
    TOKEN_ISSUER: process.env.TOKEN_ISSUER,
    TOKEN_AUDIENCE: process.env.TOKEN_AUDIENCE,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    API_ROOT: `${process.env.API_ROOT}/v${process.env.VERSION}`,
    NODE_ENV: process.env.NODE_ENV,
    APP_NAME: process.env.APP_NAME,
    VERSION: process.env.VERSION,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_SCHEMA: process.env.DB_SCHEMA,
    DB_PREFIX: process.env.DB_PREFIX,
    VERIFICATION_EMAIL_TTL_IN_MINUTES: process.env.VERIFICATION_EMAIL_TTL_IN_MINUTES,
    VERIFICATION_OTP_TTL_IN_MINUTES: process.env.VERIFICATION_OTP_TTL_IN_MINUTES,
    EMAIL_SENDER_ADDRESS: process.env.EMAIL_SENDER_ADDRESS,
    EMAIL_SENDER_PASSWORD: process.env.EMAIL_SENDER_PASSWORD,
    RESET_PASSWORD_ROUTE: process.env.RESET_PASSWORD_ROUTE,
    APP_BASE_URL: process.env.APP_BASE_URL,
    DIRECTORY: process.env.DIRECTORY,
    ALLOW_CORS_DOMAIN: process.env.ALLOW_CORS_DOMAIN,
};
