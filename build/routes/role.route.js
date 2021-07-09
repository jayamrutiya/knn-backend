"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../config/container");
const types_1 = require("../config/types");
const RoleController_1 = __importDefault(require("../controllers/RoleController"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("../config/passport"));
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const roleService = container_1.iocContainer.get(types_1.TYPES.RoleService);
const roleController = new RoleController_1.default(loggerService, roleService);
router.get('/:id', passport_1.default.authenticate('jwt', { session: false }), (req, res) => roleController.getUserRole(req, res));
exports.default = router;
