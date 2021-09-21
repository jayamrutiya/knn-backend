import express from 'express';
import { TYPES } from '../config/types';
import { iocContainer as Container } from '../config/container';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IAuthenticationService } from '../interfaces/IAuthenticationService';
import AuthenticationController from '../controllers/AuthenticationController';
import path from 'path';

const router = express.Router();

// Get service instance and create a new User controller
const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
const authenticationService = Container.get<IAuthenticationService>(
  TYPES.AuthenticationService,
);
const authenticationController = new AuthenticationController(
  loggerService,
  authenticationService,
);

// ToDo: validation
router.post('/login', (req: express.Request, res: express.Response) =>
  authenticationController.doLogin(req, res),
);

// ToDo: validation
router.post('/refresh', (req: express.Request, res: express.Response) =>
  authenticationController.refreshToken(req, res),
);

router.post('/password/forgot', (req: express.Request, res: express.Response) =>
  authenticationController.forgotPassword(req, res),
);

router.post('/password/reset', (req: express.Request, res: express.Response) =>
  authenticationController.resetPassword(req, res),
);

export default router;
