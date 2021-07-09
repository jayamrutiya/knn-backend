import { TYPES } from '../config/types';
import IBookRepository from '../interfaces/IBookRepository';
import { IBookService } from '../interfaces/IBookService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { inject, injectable } from 'inversify';
import { createBook, editBook, GetBookById } from '../types/Book';
import { BadRequest } from '../errors/BadRequest';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';

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

  async createBook(newBook: createBook): Promise<GetBookById | undefined> {
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
        newBook.authorName,
      );

      if (findBookByName === undefined || findBookByName === null) {
        book = await this._bookRepository.createBook(newBook);
      } else {
        // update stock
        await this._bookRepository.updateBookStock(findBookByName.id, true);
        book = findBookByName;
      }

      const totalBook = parseInt(userSubscriptionUsage.noOfBookUploaded) + 1;

      await this._userRepository.updateUserSubscriptionUsage(
        userSubscriptionUsage.id,
        totalBook,
        userSubscriptionUsage.priceDeposited,
      );

      if (userSubscription.noOfBook === totalBook) {
        const getRoleId = await this._roleRepository.getRoleByName('Member');

        // const getUserRole = await this._roleRepository.getUserRole(
        //   newBook.createdBy,
        // );

        await this._roleRepository.updateUserRoler(getRoleId.id, userRole.id);
      }
    }

    if (userRole.Role === 'Platform Admin') {
      const findBookByName = await this._bookRepository.getBookByNameAndAuthor(
        newBook.bookName,
        newBook.authorName,
      );

      if (findBookByName === undefined || findBookByName === null) {
        book = await this._bookRepository.createBook(newBook);
      } else {
        // update stock
        await this._bookRepository.updateBookStock(findBookByName.id, true);
        book = findBookByName;
      }
    }

    return book;
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
}
