"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("../config/types");
const container_1 = require("../config/container");
const AuthenticationController_1 = __importDefault(require("../controllers/AuthenticationController"));
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const authenticationService = container_1.iocContainer.get(types_1.TYPES.AuthenticationService);
const authenticationController = new AuthenticationController_1.default(loggerService, authenticationService);
// ToDo: validation
router.post('/login', (req, res) => authenticationController.doLogin(req, res));
// ToDo: validation
router.post('/refresh', (req, res) => authenticationController.refreshToken(req, res));
exports.default = router;
