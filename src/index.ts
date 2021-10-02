import app from './config/express';
import * as express from 'express';
import ENV from './config/env';
import { iocContainer as Container } from './config/container';
import { TYPES } from './config/types';
import { ILoggerService } from './interfaces/ILoggerService';

const allowlist: any[string] = ENV.ALLOW_CORS_DOMAIN;
app.get(
  `${ENV.API_ROOT}/images/:name`,
  (req: express.Request, res: express.Response) => {
    let domains = JSON.parse(allowlist);
    res.header(
      'Content-Security-Policy',
      `frame-ancestors 'self' ${domains.join(' ')}`,
    );
    // console.log(res.header('Content-Security-Policy'));
    res.sendFile(`./public/images/${req.params.name}`, { root: __dirname });
  },
);

// Start Express server
app.listen(ENV.PORT, () => {
  const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
  loggerService
    .getLogger()
    .info(`⚡️[server]: Server is running at http://localhost:${ENV.PORT}`);
  loggerService
    .getLogger()
    .info(`⚡️[server]: API ROOT: http://localhost:${ENV.PORT}${ENV.API_ROOT}`);
});
