import { IBookService } from '../interfaces/IBookService';
import { ILoggerService } from '../interfaces/ILoggerService';
import BaseController from './BaseController';
import { inject, injectable } from 'inversify';
import * as express from 'express';
import { createBook, editBook } from '../types/Book';

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

  async createBook(req: express.Request, res: express.Response) {
    try {
      // get parameters
      const {
        bookName,
        authorName,
        isbn,
        pages,
        description,
        price,
        createdBy,
      } = req.body;

      const newBook: createBook = {
        bookName,
        authorName,
        isbn,
        pages: parseInt(pages),
        description,
        price,
        titleImage: req.file
          ? 'http://127.0.0.1:3000/images/' + req.file.filename
          : 'no image',
        createdBy: BigInt(createdBy),
      };

      console.log(newBook, 'newBook');

      const book = await this._bookService.createBook(newBook);

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
        authorName,
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
        authorName,
        isbn,
        pages: parseInt(pages),
        description,
        price,
        titleImage: req.file
          ? 'http://127.0.0.1:3000/images/' + req.file.filename
          : 'no image',
        stock: BigInt(stock),
        verifyBy: BigInt(verifyBy),
        isActivated: isActivated == 'true' ? true : false,
      };

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
}
