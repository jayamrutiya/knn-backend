import express from 'express';
import { TYPES } from '../config/types';
import { iocContainer as Container } from '../config/container';
import { ILoggerService } from '../interfaces/ILoggerService';
import { ICategoryService } from '../interfaces/ICategoryService';
import CategoryController from '../controllers/CategoryController';

const router = express.Router();

// Get service instance and create a new User controller
const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
const categoryService = Container.get<ICategoryService>(TYPES.CategoryService);
const categoryController = new CategoryController(
  loggerService,
  categoryService,
);

router.get('/', (req, res) => categoryController.getCategories(req, res));

router.post('/', (req, res) => categoryController.createCategory(req, res));

router.delete('/:id', (req, res) =>
  categoryController.deleteCategory(req, res),
);

export default router;
