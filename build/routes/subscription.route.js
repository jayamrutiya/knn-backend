"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../config/container");
const types_1 = require("../config/types");
const SubscriptionController_1 = __importDefault(require("../controllers/SubscriptionController"));
const multer_1 = require("../config/multer");
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const subscriptionService = container_1.iocContainer.get(types_1.TYPES.SubscriptionService);
const subscriptionController = new SubscriptionController_1.default(loggerService, subscriptionService);
router.get('/:id', (req, res) => subscriptionController.getSubscription(req, res));
router.get('/', (req, res) => subscriptionController.getAllSubscription(req, res));
router.post('/user', multer_1.uploadBookTitleImage.array('titleImage', 3), (req, res) => subscriptionController.userBuySubscription(req, res));
exports.default = router;
