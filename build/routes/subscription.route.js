"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = require("../config/container");
const passport_1 = __importDefault(require("../config/passport"));
const types_1 = require("../config/types");
const SubscriptionController_1 = __importDefault(require("../controllers/SubscriptionController"));
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const subscriptionService = container_1.iocContainer.get(types_1.TYPES.SubscriptionService);
const subscriptionController = new SubscriptionController_1.default(loggerService, subscriptionService);
router.get('/:id', passport_1.default.authenticate('jwt', { session: false }), (req, res) => subscriptionController.getSubscription(req, res));
router.get('/', passport_1.default.authenticate('jwt', { session: false }), (req, res) => subscriptionController.getAllSubscription(req, res));
router.put('/:subscriptionId/user/:userId', (req, res) => subscriptionController.userBuySubscription(req, res));
exports.default = router;
