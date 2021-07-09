"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CustomerController_1 = __importDefault(require("../controllers/CustomerController"));
const types_1 = require("../config/types");
const container_1 = require("../config/container");
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const customerService = container_1.iocContainer.get(types_1.TYPES.CustomerService);
const customerController = new CustomerController_1.default(loggerService, customerService);
router.post('/', (req, res) => customerController.createCustomer(req, res));
exports.default = router;
