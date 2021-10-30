import express from 'express';
import { TYPES } from '../config/types';
import { iocContainer as Container } from '../config/container';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IUserService } from '../interfaces/IUserService';
import UserController from '../controllers/UserController';
import createUserValidator from '../validators/create-user.validator';
import { uploadBookTitleImage, uploadProfilePicture } from '../config/multer';

const router = express.Router();

// Get service instance and create a new User controller
const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
const userService = Container.get<IUserService>(TYPES.UserService);
const userController = new UserController(loggerService, userService);

// ToDo: validation
router.get('/verifyUserName', (req, res) =>
  userController.doesUserNameExist(req, res),
);

router.post(
  '/',
  uploadBookTitleImage.single('profilePicture'),
  (req: express.Request, res: express.Response) =>
    userController.createUser(req, res),
);

router.post('/cart/add', (req: express.Request, res: express.Response) =>
  userController.addToCart(req, res),
);

router.get('/:userId/cart', (req: express.Request, res: express.Response) =>
  userController.getCartByUserId(req, res),
);

router.delete('/cart/:id', (req: express.Request, res: express.Response) =>
  userController.deleteCartItem(req, res),
);

router.post('/order', (req: express.Request, res: express.Response) =>
  userController.generateOrder(req, res),
);

router.post('/verify', (req: express.Request, res: express.Response) =>
  userController.verifyUser(req, res),
);

router.post('/info/:userId', (req: express.Request, res: express.Response) =>
  userController.getUser(req, res),
);

router.get('/:userId/count', (req: express.Request, res: express.Response) =>
  userController.getUserWithCount(req, res),
);

router.put(
  '/:id',
  uploadProfilePicture.single('profilePicture'),
  (req: express.Request, res: express.Response) =>
    userController.updateUser(req, res),
);

export default router;
