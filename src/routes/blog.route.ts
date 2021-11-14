import express from 'express';
import { TYPES } from '../config/types';
import { iocContainer as Container } from '../config/container';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IBlogService } from '../interfaces/IBlogService';
import BlogController from '../controllers/BlogController';
import { uploadBookTitleImage } from '../config/multer';

const router = express.Router();

// Get service instance and create a new User controller
const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
const blogService = Container.get<IBlogService>(TYPES.BlogService);
const blogController = new BlogController(loggerService, blogService);

router.post('/', uploadBookTitleImage.single('titleImage'), (req, res) =>
  blogController.createBlog(req, res),
);

router.get('/:id', (req, res) => blogController.getBlog(req, res));

router.get('/', (req, res) => blogController.getAllBlog(req, res));

router.put('/:id', uploadBookTitleImage.single('titleImage'), (req, res) =>
  blogController.updateBlog(req, res),
);

router.post(
  '/writer',
  uploadBookTitleImage.single('profilePicture'),
  (req, res) => blogController.createBlogWriter(req, res),
);

router.delete('/:blogId', (req, res) => blogController.deleteBlog(req, res));

export default router;
