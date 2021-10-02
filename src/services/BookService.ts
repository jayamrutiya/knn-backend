import { TYPES } from '../config/types';
import { IBookRepository } from '../interfaces/IBookRepository';
import { IBookService } from '../interfaces/IBookService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { inject, injectable } from 'inversify';
import {
  createBook,
  editBook,
  GetBookById,
  GetBookCategory,
  GetBookReview,
} from '../types/Book';
import { BadRequest } from '../errors/BadRequest';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { NotFound } from '../errors/NotFound';

@injectable()
export class BookService implements IBookService {
  private _loggerService: ILoggerService;

  private _bookRepository: IBookRepository;

  private _roleRepository: IRoleRepository;

  private _userRepository: IUserRepository;

  private _subscriptionRepository: ISubscriptionRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.BookRepository) bookRepository: IBookRepository,
    @inject(TYPES.RoleRepository) roleRepository: IRoleRepository,
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.SubscriptionRepository)
    subscriptionRepository: ISubscriptionRepository,
  ) {
    this._loggerService = loggerService;
    this._bookRepository = bookRepository;
    this._roleRepository = roleRepository;
    this._userRepository = userRepository;
    this._subscriptionRepository = subscriptionRepository;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async getBookById(bookId: bigint): Promise<GetBookById> {
    return this._bookRepository.getBookById(bookId);
  }

  async createBook(
    newBook: createBook,
    authorName: string,
  ): Promise<GetBookById | undefined> {
    // get user role
    const userRole = await this._roleRepository.getUserRole(newBook.createdBy);
    let book;

    if (userRole.Role === 'Member') {
      throw new BadRequest('User not have permission to create book');
    }

    if (userRole.Role === 'User') {
      const userSubscription = await this._userRepository.getUserSubscription(
        newBook.createdBy,
      );

      const userSubscriptionUsage = await this._userRepository.getUserSubscriptionUsage(
        userSubscription.id,
      );

      const subscription = await this._subscriptionRepository.getSubscription(
        userSubscription.subscriptionId,
      );

      if (subscription.type === 'DEPOSITE') {
        throw new BadRequest('User not have permission to create book');
      }

      if (
        userSubscription.noOfBook === userSubscriptionUsage.noOfBookUploaded
      ) {
        throw new BadRequest('User not have permission to create book');
      }

      const findBookByName = await this._bookRepository.getBookByNameAndAuthor(
        newBook.bookName,
        authorName,
      );

      if (findBookByName === undefined || findBookByName === null) {
        book = await this._bookRepository.createBook(newBook);
      } else {
        // update stock
        await this._bookRepository.updateBookStock(findBookByName.id, true);
        book = findBookByName;
      }

      await this._userRepository.createUserBook(newBook.createdBy, book!.id);

      const totalBook = parseInt(userSubscriptionUsage.noOfBookUploaded) + 1;

      await this._userRepository.updateUserSubscriptionUsage(
        userSubscriptionUsage.id,
        totalBook,
        userSubscriptionUsage.priceDeposited,
      );

      // if (userSubscription.noOfBook === totalBook) {
      //   const getRoleId = await this._roleRepository.getRoleByName('Member');

      //   // const getUserRole = await this._roleRepository.getUserRole(
      //   //   newBook.createdBy,
      //   // );

      //   await this._roleRepository.updateUserRoler(getRoleId.id, userRole.id);
      // }
    }

    if (userRole.Role === 'Platform Admin') {
      let getBookAuthor = null;
      if (newBook.authorId) {
        getBookAuthor = await this._bookRepository.getBookAuthorById(
          newBook.authorId,
        );
      }

      if (getBookAuthor === null) {
        throw new NotFound('Author not found.');
      }
      const findBookByName = await this._bookRepository.getBookByNameAndAuthor(
        newBook.bookName,
        getBookAuthor.name,
      );

      if (findBookByName === undefined || findBookByName === null) {
        book = await this._bookRepository.createBook(newBook);
      } else {
        // update stock
        await this._bookRepository.updateBookStock(findBookByName.id, true);
        book = findBookByName;
      }

      await this._userRepository.createUserBook(newBook.createdBy, book!.id);
    }

    return book;
  }

  async createBookCategory(
    bookId: bigint,
    categoryId: bigint,
  ): Promise<GetBookCategory> {
    return this._bookRepository.createBookCategory(bookId, categoryId);
  }

  async getBookByCategory(categoryId: bigint): Promise<any> {
    return this._bookRepository.getBookByCategory(categoryId);
  }

  async getBookByNameAndAuthor(
    bookName: string,
    authorName: string,
  ): Promise<GetBookById | undefined | null> {
    return this._bookRepository.getBookByNameAndAuthor(bookName, authorName);
  }

  async editBook(updateBook: editBook): Promise<boolean> {
    return this._bookRepository.editBook(updateBook);
  }

  async deleteBook(bookId: bigint): Promise<boolean> {
    return this._bookRepository.deleteBook(bookId);
  }

  async bookStatus(bookId: bigint, status: boolean): Promise<boolean> {
    return this._bookRepository.bookStatus(bookId, status);
  }

  async doBookLikeDislike(
    bookId: bigint,
    userId: bigint,
    isLiked: boolean,
  ): Promise<boolean> {
    const user = await this._userRepository.getUserById(userId);
    if (user === null) {
      throw new NotFound(`User not found with id ${userId}`);
    }
    await this._bookRepository.getBookById(bookId);
    const bookLikeDislike = await this._bookRepository.getBookLikeDislike(
      bookId,
      userId,
    );
    if (bookLikeDislike !== null) {
      return this._bookRepository.updateBookLikeDislike(
        bookLikeDislike.id,
        isLiked,
      );
    }
    return this._bookRepository.doBookLikeDislike(bookId, userId, isLiked);
  }

  async addBookReview(
    bookId: bigint,
    userId: bigint,
    review: string,
  ): Promise<GetBookReview> {
    // comment
    const user = await this._userRepository.getUserById(userId);
    if (user === null) {
      throw new NotFound(`User not found with id ${userId}`);
    }
    await this._bookRepository.getBookById(bookId);

    return this._bookRepository.addBookReview(bookId, userId, review);
  }

  async createBookRating(
    userId: bigint,
    bookId: bigint,
    rating: number,
  ): Promise<boolean> {
    const user = await this._userRepository.getUserById(userId);

    if (user === null) {
      throw new NotFound(`User not found with id ${userId}`);
    }

    await this._bookRepository.getBookById(bookId);

    const bookRating = await this._bookRepository.getBookRating(userId, bookId);

    let bookrating;

    if (bookRating !== null) {
      bookrating = await this._bookRepository.updateBookRating(
        bookRating.id,
        rating,
      );
    }

    bookrating = await this._bookRepository.addBookRating(
      userId,
      bookId,
      rating,
    );

    const getAvgBookRating = await this._bookRepository.getAvgBookRating(
      bookId,
    );

    const updateAvgBookRating = await this._bookRepository.updateBookAvgRating(
      bookId,
      getAvgBookRating.rating,
    );

    return bookrating;
  }
}
