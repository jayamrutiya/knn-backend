"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("../config/types");
const container_1 = require("../config/container");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const create_user_validator_1 = __importDefault(require("../validators/create-user.validator"));
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const userService = container_1.iocContainer.get(types_1.TYPES.UserService);
const userController = new UserController_1.default(loggerService, userService);
// ToDo: validation
router.get('/verifyUserName', (req, res) => userController.doesUserNameExist(req, res));
router.post('/', create_user_validator_1.default, (req, res) => userController.createUser(req, res));
router.post('/cart/add', (req, res) => userController.addToCart(req, res));
router.post('/order', (req, res) => userController.generateOrder(req, res));
exports.default = router;
