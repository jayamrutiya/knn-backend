import { iocContainer as Container } from '../config/container';
import { TYPES } from '../config/types';
import RoleController from '../controllers/RoleController';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IRoleService } from '../interfaces/IRoleService';
import express from 'express';
import passport from '../config/passport';

const router = express.Router();

// Get service instance and create a new User controller
const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
const roleService = Container.get<IRoleService>(TYPES.RoleService);
const roleController = new RoleController(loggerService, roleService);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req: express.Request, res: express.Response) =>
    roleController.getUserRole(req, res),
);

export default router;
