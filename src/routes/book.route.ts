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

router.get('/trading', (req, res) => bookController.tredingThisWeek(req, res));

router.get('/most/loved', (req, res) =>
  bookController.mostLovedBooks(req, res),
);

router.get('/:id', (req, res) => bookController.getBookById(req, res));

router.post('/', uploadBookTitleImage.single('titleImage'), (req, res) =>
  bookController.createBook(req, res),
);

router.post('/:bookId/category/:categoryId', (req, res) =>
  bookController.createBookCategory(req, res),
);

router.get('/category/:categoryId', (req, res) =>
  bookController.getBookByCategory(req, res),
);

router.get('/', (req, res) => bookController.getBooks(req, res));

router.put('/:id', uploadBookTitleImage.single('titleImage'), (req, res) =>
  bookController.editBook(req, res),
);

router.delete('/:id', (req, res) => bookController.deleteBook(req, res));

router.put('/:id/status', (req, res) => bookController.bookStatus(req, res));

router.post('/like/dislike', (req, res) =>
  bookController.doBookLikeDislike(req, res),
);

router.post('/review', (req, res) => bookController.addBookReview(req, res));

router.post('/rating', (req, res) => bookController.createBookRating(req, res));

export default router;
