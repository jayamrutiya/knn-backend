import { Decimal } from '@prisma/client/runtime';
import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { NotFound } from '../errors/NotFound';
import { ILoggerService } from '../interfaces/ILoggerService';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { ISubscriptionService } from '../interfaces/ISubscriptionService';
import { IUserRepository } from '../interfaces/IUserRepository';
import {
  CreateUserSubscription,
  CreateUserSubscriptionUsage,
  GetSubscription,
} from '../types/Subscription';

@injectable()
export class SubscriptionService implements ISubscriptionService {
  private _loggerService: ILoggerService;

  private _subscriptionRepository: ISubscriptionRepository;

  private _userRepository: IUserRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.SubscriptionRepository)
    subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
  ) {
    this._loggerService = loggerService;
    this._subscriptionRepository = subscriptionRepository;
    this._userRepository = userRepository;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async getSubscription(subscriptionId: bigint): Promise<GetSubscription> {
    return this._subscriptionRepository.getSubscription(subscriptionId);
  }

  async getAllSubscription(): Promise<GetSubscription[]> {
    return this._subscriptionRepository.getAllSubscription();
  }

  async userBuySubscription(
    userId: bigint,
    subscriptionId: bigint,
  ): Promise<boolean> {
    const user = await this._userRepository.getUserById(userId);

    if (user) {
      const subscription = await this._subscriptionRepository.getSubscription(
        subscriptionId,
      );

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

      const userSubscription = await this._subscriptionRepository.createUserSubscription(
        newUserSubscription,
      );

      const newUserSubscriptionUsage: CreateUserSubscriptionUsage = {
        noOfBookUploaded: 0,
        priceDeposited: new Decimal(0.0),
        userSubscriptionId: userSubscription.id,
      };

      const createUserSubscriptionUsage = await this._subscriptionRepository.createUserSubscriptionUsage(
        newUserSubscriptionUsage,
      );

      return userSubscription !== null;
    } else {
      throw new NotFound(`User not found with id ${userId}`);
    }
  }
}
