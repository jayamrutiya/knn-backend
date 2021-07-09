import appRoot from 'app-root-path';
import dotenv from 'dotenv';

dotenv.config({ path: `${appRoot}/.env` });

export default {
  APP_ROOT: appRoot.path,

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

  VERIFICATION_EMAIL_TTL_IN_MINUTES:
    process.env.VERIFICATION_EMAIL_TTL_IN_MINUTES,
  VERIFICATION_OTP_TTL_IN_MINUTES: process.env.VERIFICATION_OTP_TTL_IN_MINUTES,
};
