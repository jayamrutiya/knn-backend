import { TYPES } from '../config/types';
import IBookRepository from '../interfaces/IBookRepository';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { inject, injectable } from 'inversify';
import { createBook, editBook, GetBookById } from '../types/Book';
import { NotFound } from '../errors/NotFound';
import { InternalServerError } from '../errors/InternalServerError';
import moment from 'moment';

@injectable()
export class BookRepository implements IBookRepository {
  private _loggerService: ILoggerService;

  private _databaseService: IDatabaseService;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.DatabaseService) databaseService: IDatabaseService,
  ) {
    this._loggerService = loggerService;
    this._databaseService = databaseService;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async getBookById(bookId: bigint): Promise<GetBookById> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const book = await client.book.findFirst({
        where: {
          id: bookId,
        },
      });

      if (book === null) {
        throw new NotFound(`Book not found with bookId ${bookId}`);
      }

      return book;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getBookByNameAndAuthor(
    bookName: string,
    authorName: string,
  ): Promise<GetBookById | undefined | null> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const book = await client.book.findFirst({
        where: {
          bookName,
          authorName,
        },
      });

      return book;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async createBook(newBook: createBook): Promise<GetBookById | undefined> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      return await client.book.create({
        data: {
          bookName: newBook.bookName,
          authorName: newBook.authorName,
          isbn: newBook.isbn,
          pages: newBook.pages,
          description: newBook.description,
          price: newBook.price,
          titleImage: newBook.titleImage,
          createdBy: newBook.createdBy,
        },
      });
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async updateBookStock(bookId: bigint, increment: boolean): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const book = await client.book.update({
        where: {
          id: bookId,
        },
        data: {
          stock: increment
            ? {
                increment: 1,
              }
            : {
                decrement: 1,
              },
        },
      });

      return book !== null;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async editBook(updateBook: editBook): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const book = await client.book.update({
        where: {
          id: updateBook.id,
        },
        data: {
          bookName: updateBook.bookName,
          authorName: updateBook.authorName,
          isbn: updateBook.isbn,
          pages: updateBook.pages,
          description: updateBook.description,
          price: updateBook.price,
          titleImage: updateBook.titleImage,
          stock: updateBook.stock,
          verifyBy: updateBook.verifyBy,
          isActivated: updateBook.isActivated,
          updatedAt: moment().format(),
        },
      });

      if (book == undefined || book == null) {
        throw new NotFound(`Book not found with id ${updateBook.id}`);
      }

      return book !== null;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async deleteBook(bookId: bigint): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const book = await client.book.delete({
        where: {
          id: bookId,
        },
      });

      if (book == undefined || book == null) {
        throw new NotFound(`Book not found with id ${bookId}`);
      }

      return book !== null;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async bookStatus(bookId: bigint, status: boolean): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const book = await client.book.update({
        where: {
          id: bookId,
        },
        data: {
          isActivated: status,
        },
      });

      return book !== null;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }
}
