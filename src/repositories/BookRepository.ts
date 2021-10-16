import { TYPES } from '../config/types';
import { IBookRepository } from '../interfaces/IBookRepository';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { inject, injectable } from 'inversify';
import {
  createBook,
  editBook,
  GetBookAuthor,
  GetBookById,
  GetBookCategory,
  GetBookLikeDislike,
  GetBookRating,
  GetBookReview,
} from '../types/Book';
import { NotFound } from '../errors/NotFound';
import { InternalServerError } from '../errors/InternalServerError';
import moment from 'moment';
import { CategoryType } from '@prisma/client';

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
        include: {
          BookAuthor: true,
          BookReview: true,
          BookLikeDislike: {
            where: {
              isLiked: true,
            },
          },
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

  async getBookByCategory(categoryId: bigint): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const book = await client.bookCategory.findMany({
        where:
          categoryId !== 0n
            ? {
                categoryId,
                Book: {
                  isActivated: true,
                },
              }
            : {
                Book: {
                  isActivated: true,
                },
              },
        select: {
          Category: {
            select: {
              categoryName: true,
            },
          },
          Book: {
            select: {
              id: true,
              bookName: true,
              titleImage: true,
              avgRating: true,
              price: true,
              stock: true,
            },
          },
        },
      });

      console.log('book', book);

      const bookDetails = await book.map((d) => {
        return {
          ...d.Book,
          categoryName: d.Category.categoryName,
        };
      });

      return bookDetails;
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
          BookAuthor: {
            name: authorName,
          },
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

  async getBookAuthorById(id: bigint): Promise<GetBookAuthor | null> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookAuthor = await client.bookAuthor.findFirst({
        where: {
          id,
        },
      });

      return bookAuthor;
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

  async createBook(newBook: createBook): Promise<GetBookById | undefined> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      return await client.book.create({
        data: {
          bookName: newBook.bookName,
          authorId: newBook.authorId,
          isbn: newBook.isbn,
          pages: newBook.pages,
          description: newBook.description,
          price: newBook.price,
          titleImage: newBook.titleImage,
          createdBy: newBook.createdBy,
          verifyBy: newBook.verifyBy,
        },
      });
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

  async createBookCategory(
    bookId: bigint,
    categoryId: bigint,
  ): Promise<GetBookCategory> {
    try {
      const client = this._databaseService.Client();

      const bookCategory = await client.bookCategory.create({
        data: {
          bookId,
          categoryId,
        },
      });

      return bookCategory;
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
          authorId: updateBook.authorId,
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

  async doBookLikeDislike(
    bookId: bigint,
    userId: bigint,
    isLiked: boolean,
  ): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookLikeDislike = await client.bookLikeDislike.create({
        data: {
          bookId,
          userId,
          isLiked,
        },
      });

      return bookLikeDislike !== null;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getBookLikeDislike(
    bookId: bigint,
    userId: bigint,
  ): Promise<GetBookLikeDislike> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookLikeDislike = await client.bookLikeDislike.findFirst({
        where: {
          bookId,
          userId,
        },
      });

      return bookLikeDislike;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async updateBookLikeDislike(id: bigint, isLiked: boolean): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookLikeDislike = await client.bookLikeDislike.update({
        where: {
          id,
        },
        data: {
          isLiked,
          updatedAt: moment().format(),
        },
      });

      return bookLikeDislike !== null;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async addBookReview(
    bookId: bigint,
    userId: bigint,
    review: string,
  ): Promise<GetBookReview> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookReview = await client.bookReview.create({
        data: {
          bookId,
          userId,
          review,
        },
      });

      return bookReview;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async addBookRating(
    userId: bigint,
    bookId: bigint,
    rating: number,
  ): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookRating = await client.bookRating.create({
        data: {
          userId,
          bookId,
          rating,
        },
      });

      return bookRating !== null;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async updateBookRating(id: bigint, rating: number): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookRating = await client.bookRating.update({
        where: {
          id,
        },
        data: {
          rating,
        },
      });

      return bookRating !== null;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getBookRating(
    userId: bigint,
    bookId: bigint,
  ): Promise<GetBookRating | null> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookRating = await client.bookRating.findFirst({
        where: {
          userId,
          bookId,
        },
      });

      return bookRating;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getAvgBookRating(bookId: bigint): Promise<{ rating: number | null }> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookAvgRating = await client.bookRating.aggregate({
        _avg: {
          rating: true,
        },
      });

      console.log(bookAvgRating);

      return bookAvgRating._avg;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async updateBookAvgRating(
    bookId: bigint,
    avgRating: number | null,
  ): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const book = await client.book.update({
        where: {
          id: bookId,
        },
        data: {
          avgRating,
          updatedAt: moment().format(),
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
