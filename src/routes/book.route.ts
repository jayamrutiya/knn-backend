import express from 'express';
import { TYPES } from '../config/types';
import { iocContainer as Container } from '../config/container';
import BookController from '../controllers/BookController';
import { IBookService } from '../interfaces/IBookService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { uploadBookTitleImage } from '../config/multer';

const router = express.Router();

// Get service instance and create a new User controller
const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
const bookService = Container.get<IBookService>(TYPES.BookService);
const bookController = new BookController(loggerService, bookService);

router.post('/', uploadBookTitleImage.single('titleImage'), (req, res) =>
  bookController.createBook(req, res),
);

router.put('/:id', uploadBookTitleImage.single('titleImage'), (req, res) =>
  bookController.editBook(req, res),
);

router.delete('/:id', (req, res) => bookController.deleteBook(req, res));

export default router;
