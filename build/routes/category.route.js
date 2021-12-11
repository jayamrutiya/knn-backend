"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("../config/types");
const container_1 = require("../config/container");
const CategoryController_1 = __importDefault(require("../controllers/CategoryController"));
const router = express_1.default.Router();
// Get service instance and create a new User controller
const loggerService = container_1.iocContainer.get(types_1.TYPES.LoggerService);
const categoryService = container_1.iocContainer.get(types_1.TYPES.CategoryService);
const categoryController = new CategoryController_1.default(loggerService, categoryService);
router.get('/', (req, res) => categoryController.getCategories(req, res));
router.post('/', (req, res) => categoryController.createCategory(req, res));
router.delete('/:id', (req, res) => categoryController.deleteCategory(req, res));
exports.default = router;
