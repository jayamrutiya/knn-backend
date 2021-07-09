import express from 'express';
import { iocContainer as Container } from '../config/container';
import passport from '../config/passport';
import { TYPES } from '../config/types';
import SubscriptionController from '../controllers/SubscriptionController';
import { ILoggerService } from '../interfaces/ILoggerService';
import { ISubscriptionService } from '../interfaces/ISubscriptionService';

const router = express.Router();

// Get service instance and create a new User controller
const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
const subscriptionService = Container.get<ISubscriptionService>(
  TYPES.SubscriptionService,
);
const subscriptionController = new SubscriptionController(
  loggerService,
  subscriptionService,
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req: express.Request, res: express.Response) =>
    subscriptionController.getSubscription(req, res),
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req: express.Request, res: express.Response) =>
    subscriptionController.getAllSubscription(req, res),
);

router.put(
  '/:subscriptionId/user/:userId',
  (req: express.Request, res: express.Response) =>
    subscriptionController.userBuySubscription(req, res),
);

export default router;
