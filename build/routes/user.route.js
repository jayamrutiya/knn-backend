"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("../config/types");
const container_1 = require("../config/container");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const userService = container_1.iocContainer.get(types_1.TYPES.UserService);
const userController = new UserController_1.default(loggerService, userService);
// ToDo: validation
router.get('/verifyUserName', (req, res) => userController.doesUserNameExist(req, res));
router.post('/', multer_1.uploadBookTitleImage.single('profilePicture'), (req, res) => userController.createUser(req, res));
router.post('/cart/add', (req, res) => userController.addToCart(req, res));
router.get('/:userId/cart', (req, res) => userController.getCartByUserId(req, res));
router.delete('/cart/:id', (req, res) => userController.deleteCartItem(req, res));
router.post('/order', (req, res) => userController.generateOrder(req, res));
router.post('/verify', (req, res) => userController.verifyUser(req, res));
router.get('/info/:userId', (req, res) => userController.getUser(req, res));
router.get('/:userId/count', (req, res) => userController.getUserWithCount(req, res));
router.put('/:id', multer_1.uploadProfilePicture.single('profilePicture'), (req, res) => userController.updateUser(req, res));
router.get('/new', (req, res) => userController.newUser(req, res));
router.get('/orders', (req, res) => userController.getOrder(req, res));
router.put('/orders/:orderId', (req, res) => userController.orderStatusChange(req, res));
router.get('/order/details/:id', (req, res) => userController.getOrderById(req, res));
exports.default = router;
