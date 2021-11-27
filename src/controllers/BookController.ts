import { IBookService } from '../interfaces/IBookService';
import { ILoggerService } from '../interfaces/ILoggerService';
import BaseController from './BaseController';
import { inject, injectable } from 'inversify';
import * as express from 'express';
import { createBook, editBook } from '../types/Book';
import ENV from '../config/env';
import { Decimal } from '@prisma/client/runtime';

@injectable()
export default class BookController extends BaseController {
  private _loggerService: ILoggerService;

  private _bookService: IBookService;

  constructor(loggerService: ILoggerService, bookService: IBookService) {
    super();
    this._loggerService = loggerService;
    this._bookService = bookService;
    this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
  }

  async getBookById(req: express.Request, res: express.Response) {
    try {
      const bookId = BigInt(req.params.id);

      const book = await this._bookService.getBookById(bookId);

      // Return response
      return this.sendJSONResponse(
        res,
        'Book fetched successfully',
        {
          length: 1,
        },
        book,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async createBook(req: express.Request, res: express.Response) {
    try {
      // get parameters
      const {
        bookName,
        authorId,
        authorName,
        isbn,
        pages,
        description,
        price,
        createdBy,
        verifyBy,
      } = req.body;

      const newBook: createBook = {
        bookName,
        authorId: authorId === '' ? null : BigInt(authorId),
        isbn,
        pages: pages === '' ? null : parseInt(pages),
        description,
        price: new Decimal(price),
        titleImage: req.file
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
          : 'no image',
        createdBy: BigInt(createdBy),
        verifyBy:
          verifyBy != null || verifyBy != 'null' || verifyBy != undefined
            ? BigInt(verifyBy)
            : verifyBy,
      };

      console.log(newBook, 'newBook');

      const book = await this._bookService.createBook(newBook, authorName);

      // Return response
      return this.sendJSONResponse(
        res,
        'Book created successfully',
        {
          length: 1,
        },
        book,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async createBookCategory(req: express.Request, res: express.Response) {
    try {
      const bookId = BigInt(req.params.bookId);
      const categoryId = BigInt(req.params.categoryId);

      const bookCategoy = await this._bookService.createBookCategory(
        bookId,
        categoryId,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Book Category created successfully',
        {
          length: 1,
        },
        bookCategoy,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getBookByCategory(req: express.Request, res: express.Response) {
    try {
      const categoryId = BigInt(req.params.categoryId);

      let book = await this._bookService.getBookByCategory(categoryId);

      book = await book.map((data: any) => {
        delete data.BookAuthor;
        delete data.User;
        return {
          ...data,
        };
      });

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: book.length,
        },
        book,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getBooks(req: express.Request, res: express.Response) {
    try {
      let book = await this._bookService.getBooks();

      book = await book.map((data: any) => {
        delete data.BookAuthor;
        delete data.User;
        return {
          ...data,
        };
      });

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: book.length,
        },
        book,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getBookByNameAndAuthor(req: express.Request, res: express.Response) {
    try {
      // get parameters
      const bookName = req.body.bookName.toString();
      const author = req.body.author.toString();

      const book = await this._bookService.getBookByNameAndAuthor(
        bookName,
        author,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Book fetched successfully',
        {
          length: 1,
        },
        book,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async editBook(req: express.Request, res: express.Response) {
    try {
      // get parameters
      const {
        bookName,
        authorId,
        isbn,
        pages,
        description,
        price,
        stock,
        verifyBy,
        isActivated,
      } = req.body;

      const updateBook: editBook = {
        id: BigInt(req.params.id),
        bookName,
        authorId: BigInt(authorId),
        isbn,
        pages: parseInt(pages),
        description,
        price,
        titleImage: req.file
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
          : 'no image',
        stock: BigInt(stock),
        verifyBy: BigInt(verifyBy),
        isActivated: isActivated == 'true' ? true : false,
      };

      console.log('updateBook ', updateBook);

      const book = await this._bookService.editBook(updateBook);

      // Return response
      return this.sendJSONResponse(res, 'Book update successfully', null, null);
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async deleteBook(req: express.Request, res: express.Response) {
    try {
      const bookId = BigInt(req.params.id);

      const book = await this._bookService.deleteBook(bookId);

      // Return response
      return this.sendJSONResponse(res, 'Book delete successfully', null, null);
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async bookStatus(req: express.Request, res: express.Response) {
    try {
      const bookId = BigInt(req.params.id);
      const status = req.query.status === 'true';

      console.log('status', req.query.status, status);

      const book = await this._bookService.bookStatus(bookId, status);

      // Return response
      return this.sendJSONResponse(
        res,
        status
          ? 'Book activated successfully'
          : 'Book deactivated successfully',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async doBookLikeDislike(req: express.Request, res: express.Response) {
    try {
      const { userId, bookId, isLiked } = req.body;

      const doBookLikeDisLike = await this._bookService.doBookLikeDislike(
        BigInt(userId),
        BigInt(bookId),
        isLiked,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        isLiked ? 'Book liked by' : 'Book disliked',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async addBookReview(req: express.Request, res: express.Response) {
    try {
      const { userId, bookId, review } = req.body;

      const bookReview = await this._bookService.addBookReview(
        BigInt(userId),
        BigInt(bookId),
        review,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Book review added successfully',
        {
          length: 1,
        },
        bookReview,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async createBookRating(req: express.Request, res: express.Response) {
    try {
      const { userId, bookId, rating } = req.body;

      const bookRating = await this._bookService.createBookRating(
        BigInt(userId),
        BigInt(bookId),
        parseFloat(rating),
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Book rating created successfully',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async tredingThisWeek(req: express.Request, res: express.Response) {
    try {
      // Return response
      return this.sendJSONResponse(
        res,
        null,
        null,
        await this._bookService.trendingThisWeek(),
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async mostLovedBooks(req: express.Request, res: express.Response) {
    try {
      // Return response
      return this.sendJSONResponse(
        res,
        null,
        null,
        await this._bookService.mostLovedBooks(),
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getBookAuthors(req: express.Request, res: express.Response) {
    try {
      // Return response
      return this.sendJSONResponse(
        res,
        null,
        null,
        await this._bookService.getBookAuthors(),
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async deleteBookCategory(req: express.Request, res: express.Response) {
    try {
      const id = BigInt(req.params.id);
      // Return response
      return this.sendJSONResponse(
        res,
        (await this._bookService.deleteBookCategory(id))
          ? 'Deleted Successfully'
          : 'Error',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async createBookAuthor(req: express.Request, res: express.Response) {
    try {
      const name = req.body.name;
      const profile = req.file
        ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
        : 'no image';

      const authore = await this._bookService.createBookAuthor(name, profile);

      // Return response
      return this.sendJSONResponse(res, null, null, authore);
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async deleteBookAuthor(req: express.Request, res: express.Response) {
    try {
      const id = BigInt(req.params.authorId);

      const author = await this._bookService.deleteBookAuthor(id);

      // Return response
      return this.sendJSONResponse(
        res,
        author ? 'Deleted Successfully' : 'Something went wrong',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }
}
