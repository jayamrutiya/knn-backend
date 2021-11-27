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
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { BadRequest } from '../errors/BadRequest';

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
          BookCategory: {
            select: {
              id: true,
              Category: true,
            },
          },
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

  async getBooks(): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const book = await client.book.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          bookName: true,
          titleImage: true,
          isbn: true,
          avgRating: true,
          price: true,
          stock: true,
          isActivated: true,
          BookAuthor: {
            select: {
              name: true,
            },
          },
          User: {
            select: {
              UserRole: {
                select: {
                  Role: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      console.log('book', book);

      const bookDetails = await book.map((d) => {
        return {
          ...d,
          authorName: d.BookAuthor ? d.BookAuthor.name : null,
          createdBy:
            d.User.UserRole[0].Role.name === 'Member' ||
            d.User.UserRole[0].Role.name === 'User'
              ? 'User'
              : 'Platform Admin',
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

  async getBookByCategory(categoryId: bigint): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const book = await client.bookCategory.findMany({
        orderBy: {
          bookId: 'desc',
        },
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
              isbn: true,
              avgRating: true,
              price: true,
              stock: true,
              isActivated: true,
              BookAuthor: {
                select: {
                  name: true,
                },
              },
              User: {
                select: {
                  UserRole: {
                    select: {
                      Role: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      console.log('book', book);

      const bookDetails = await book.map((d) => {
        return {
          ...d.Book,
          categoryName: d.Category.categoryName,
          authorName: d.Book.BookAuthor ? d.Book.BookAuthor.name : null,
          createdBy:
            d.Book.User.UserRole[0].Role.name === 'Member' ||
            d.Book.User.UserRole[0].Role.name === 'User'
              ? 'User'
              : 'Platform Admin',
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

      const userBook = await client.userBook.deleteMany({
        where: {
          bookId,
        },
      });

      const bookCategory = await client.bookCategory.deleteMany({
        where: {
          bookId,
        },
      });

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

  async trendingThisWeek(): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const currentDate = moment().format();
      const pastDate = moment().subtract(7, 'days').format();

      const book = await client.orderDetail.findMany({
        where: {
          Order: {
            status: 'DELIVERED',
          },
          Book: {
            isActivated: true,
          },
          createdAt: {
            gte: pastDate,
            lt: currentDate,
          },
        },
        take: 4,
        select: {
          Book: {
            select: {
              id: true,
              bookName: true,
              price: true,
              titleImage: true,
              BookCategory: {
                select: {
                  Category: {
                    select: {
                      categoryName: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const responseData = await book.map((d) => {
        return {
          id: d.Book.id,
          bookName: d.Book.bookName,
          price: d.Book.price,
          titleImage: d.Book.titleImage,
          categoryName: d.Book.BookCategory[0].Category.categoryName,
        };
      });

      return responseData;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async mostLovedBooks(): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const book = await client.book.findMany({
        where: {
          isActivated: true,
          avgRating: {
            gte: 2.5,
          },
        },
        take: 10,
        include: {
          BookCategory: {
            select: {
              Category: {
                select: {
                  categoryName: true,
                },
              },
            },
          },
          BookAuthor: {
            select: {
              name: true,
            },
          },
        },
      });

      const responseData = await book.map((d) => {
        return {
          id: d.id,
          titleImage: d.titleImage,
          avgRating: d.avgRating,
          bookName: d.bookName,
          price: d.price,
          categoryName: d.BookCategory[0].Category.categoryName,
          authorName: d.BookAuthor?.name,
        };
      });

      return responseData;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async createBookAuthor(name: string, profile: string): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookAuthore = await client.bookAuthor.create({
        data: {
          name,
          profilePicture: profile,
        },
      });

      return bookAuthore;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getBookByCreateBy(userId: bigint): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const userBook = await client.userBook.findMany({
        where: {
          userId,
        },
        include: {
          Book: {
            include: {
              BookAuthor: true,
            },
          },
        },
      });

      return userBook;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getBookAuthors(): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookAuthor = await client.bookAuthor.findMany({});

      return bookAuthor;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async deleteBookCategory(id: bigint): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookCat = await client.bookCategory.delete({
        where: {
          id,
        },
      });

      return bookCat !== null;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async deleteBookAuthor(id: bigint): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const bookAuthore = await client.bookAuthor.delete({
        where: {
          id,
        },
      });

      return bookAuthore !== null;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequest('This author assign to somewhere');
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  // async getBookAuthor(id: bigint): Promise<any> {
  //   try {
  //     // Get the database client
  //     const client = this._databaseService.Client();

  //     const bookAuthore = await client.bookAuthor.findFirst({
  //       where: {
  //         id,
  //       },
  //     });

  //     if (bookAuthore === null) {
  //       throw new NotFound('BookAuthor Not found');
  //     }

  //     return bookAuthore;
  //   } catch (error) {
  //     this._loggerService.getLogger().error(`Error ${error}`);
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       throw new BadRequest('This author assign to somewhere');
  //     }
  //     throw new InternalServerError(
  //       'An error occurred while interacting with the database.',
  //     );
  //   } finally {
  //     await this._databaseService.disconnect();
  //   }
  // }
}
