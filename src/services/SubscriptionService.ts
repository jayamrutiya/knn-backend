import { Decimal } from '@prisma/client/runtime';
import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { IBookRepository } from '../interfaces/IBookRepository';
import { IJwtService } from '../interfaces/IJwtService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { ISubscriptionService } from '../interfaces/ISubscriptionService';
import { IUserRepository } from '../interfaces/IUserRepository';
import ENV from '../config/env';
import {
  CreateUserSubscription,
  CreateUserSubscriptionUsage,
  GetSubscription,
} from '../types/Subscription';
import app from '../config/express';
import { EventTypes } from '../config/events';

@injectable()
export class SubscriptionService implements ISubscriptionService {
  private _loggerService: ILoggerService;

  private _subscriptionRepository: ISubscriptionRepository;

  private _userRepository: IUserRepository;

  private _bookRepository: IBookRepository;

  private _jwtService: IJwtService;
  private _roleRepository: IRoleRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.SubscriptionRepository)
    subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.BookRepository) bookRepository: IBookRepository,
    @inject(TYPES.JwtService) jwtService: IJwtService,
    @inject(TYPES.RoleRepository) roleRepository: IRoleRepository,
  ) {
    this._loggerService = loggerService;
    this._subscriptionRepository = subscriptionRepository;
    this._userRepository = userRepository;
    this._bookRepository = bookRepository;
    this._jwtService = jwtService;
    this._roleRepository = roleRepository;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async getSubscription(subscriptionId: bigint): Promise<GetSubscription> {
    return this._subscriptionRepository.getSubscription(subscriptionId);
  }

  async getAllSubscription(): Promise<GetSubscription[]> {
    return this._subscriptionRepository.getAllSubscription();
  }

  async userBuySubscription(
    userSubscription: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this._userRepository.getUserById(
      userSubscription.userId,
    );

    if (user) {
      if (user.isSubscriptionComplete) {
        throw new BadRequest(
          'You alredy complete you subscription process. Wait for admin confirmation.',
        );
      }
      const subscription = await this._subscriptionRepository.getSubscription(
        userSubscription.subscriptionId,
      );

      if (subscription.type === 'BOOK') {
        for (let i = 0; i < subscription.noOfBook; i++) {
          const findBookByName = await this._bookRepository.getBookByNameAndAuthor(
            userSubscription.bookName[i],
            userSubscription.authorName[i],
          );
          let book;
          if (findBookByName === undefined || findBookByName === null) {
            const bookAuthor = await this._bookRepository.createBookAuthor(
              userSubscription.authorName[i],
              '',
            );
            book = await this._bookRepository.createBook({
              bookName: userSubscription.bookName[i],
              price: new Decimal(25.0),
              titleImage: userSubscription.titleImage[i],
              createdBy: userSubscription.userId,
              authorId: bookAuthor.id,
              isbn: null,
              description: null,
              pages: null,
              verifyBy: null,
            });
          } else {
            // update stock
            // await this._bookRepository.updateBookStock(findBookByName.id, true);
            book = findBookByName;
          }

          await this._userRepository.createUserBook(
            userSubscription.userId,
            book!.id,
          );
        }
      }

      const newUserSubscription: CreateUserSubscription = {
        subscriptionId: subscription.id,
        userId: user.id,
        title: subscription.title,
        description: subscription.description,
        type: subscription.type,
        noOfBook: subscription.noOfBook,
        price: subscription.price,
        deposite: subscription.deposite,
      };

      const userNewSubscription = await this._subscriptionRepository.createUserSubscription(
        newUserSubscription,
      );

      const newUserSubscriptionUsage: CreateUserSubscriptionUsage = {
        noOfBookUploaded:
          subscription.type === 'BOOK' ? subscription.noOfBook : 0,
        priceDeposited:
          subscription.type === 'DEPOSITE'
            ? subscription.deposite
            : new Decimal(0.0),
        userSubscriptionId: userNewSubscription.id,
      };

      const createUserSubscriptionUsage = await this._subscriptionRepository.createUserSubscriptionUsage(
        newUserSubscriptionUsage,
      );

      await this._userRepository.doneSubscriptionProcess(
        userSubscription.userId,
        true,
      );

      const userRole = await this._roleRepository.getUserRole(user.id);

      const accessToken = this._jwtService.generateToken(
        userRole,
        ENV.ACCESS_TOKEN_SECRET!,
        ENV.ACCESS_TOKEN_EXPIRES_IN!,
      );

      // Create a Refresh token
      const refreshToken = this._jwtService.generateToken(
        userRole,
        ENV.REFRESH_TOKEN_SECRET!,
        ENV.REFRESH_TOKEN_EXPIRES_IN!,
      );

      await this._userRepository.storeRefreshToken(user.id, refreshToken);

      // send email
      app.emit(EventTypes.SEND_COMMON_EMAIL, {
        subject: 'Knn - Buy Subscription',
        body: `<p>You Subscription process is complete please wait for admin confirmation.</p>`,
        emailId: user.emailId,
      });

      // Return token
      return { accessToken, refreshToken };
    } else {
      throw new NotFound(`User not found with id ${userSubscription.userId}`);
    }
  }
}
