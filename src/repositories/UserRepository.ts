import { inject, injectable } from 'inversify';

import { IDatabaseService } from '../interfaces/IDatabaseService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { TYPES } from '../config/types';
import { IUserRepository } from '../interfaces/IUserRepository';
import {
  AddToCart,
  CreateUser,
  GetCartByUserId,
  GetOrder,
  GetUser,
  NewOrder,
  NewOrderDetail,
} from '../types/User';
import { InternalServerError } from '../errors/InternalServerError';
import moment from 'moment';
import { User } from '@prisma/client';
import { NotFound } from '../errors/NotFound';
import { RefreshToken } from '../types/Authentication';
import { Decimal } from '@prisma/client/runtime';

@injectable()
export class UserRepository implements IUserRepository {
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

  async createUser(newUser: CreateUser): Promise<GetUser> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const user = await client.user.create({
        data: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          userName: newUser.userName,
          mobileNumber: newUser.mobileNumber,
          emailId: newUser.emailId,
          password: newUser.password,
          salt: newUser.salt,
          address: newUser.address,
          city: newUser.city,
          street: newUser.street,
          createdAt: moment().format(),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          userName: true,
          mobileNumber: true,
          emailId: true,
          address: true,
          city: true,
          street: true,
          isSuspended: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getUserByUserName(userName: string): Promise<User | null> {
    try {
      console.log(userName);

      // Get the database client
      const client = this._databaseService.Client();

      const user = await client.user.findFirst({
        where: {
          OR: [
            {
              userName,
            },
            {
              emailId: userName,
            },
          ],
        },
      });

      // if (user === null) {
      //   throw new NotFound(`User not found with userName ${userName}`);
      // }

      return user;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      // if (error instanceof NotFound) {
      //   throw error;
      // }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getUserByEmailId(emailId: string): Promise<User | null> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const user = await client.user.findFirst({
        where: {
          emailId,
        },
      });

      // if (user === null) {
      //   throw new NotFound(`User not found with userName ${userName}`);
      // }

      return user;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      // if (error instanceof NotFound) {
      //   throw error;
      // }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async setLastLogin(userId: bigint): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const user = await client.user.update({
        where: {
          id: userId,
        },
        data: {
          // lastLoginAt: moment().format(),
        },
      });

      return user !== null;
    } catch (error) {
      console.log(error);
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

  async storeRefreshToken(userId: bigint, token: string): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const storeToken = await client.refreshToken.create({
        data: {
          userId,
          Token: token,
        },
      });

      return storeToken !== null;
    } catch (error) {
      console.log(error);
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

  async getRereshToken(
    userId: bigint,
    refreshToken: string,
  ): Promise<RefreshToken> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const token = await client.refreshToken.findFirst({
        where: {
          userId,
          Token: refreshToken,
        },
        select: {
          id: false,
          userId: true,
          Token: true,
          createdAt: false,
        },
      });

      if (token === null) {
        throw new NotFound('Rfresh Token not found');
      }

      return token;
    } catch (error) {
      console.log(error);
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

  async getUserById(userId: bigint): Promise<User | null> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const user = await client.user.findFirst({
        where: {
          id: userId,
        },
      });

      // if (user === null) {
      //   throw new NotFound(`User not found with userName ${userName}`);
      // }

      return user;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      // if (error instanceof NotFound) {
      //   throw error;
      // }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getCartByUserId(userId: bigint): Promise<GetCartByUserId[]> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const cart = await client.cart.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          userId: true,
          bookId: true,
          quantity: true,
          createdAt: true,
          updatedAt: true,
          Book: true,
        },
      });

      return cart;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async addToCart(
    userId: bigint,
    bookId: bigint,
    quantity: number,
  ): Promise<AddToCart> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const cart = await client.cart.create({
        data: {
          userId,
          bookId,
          quantity,
        },
      });

      return cart;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      // if (error instanceof NotFound) {
      //   throw error;
      // }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async createOrder(newOrder: NewOrder): Promise<GetOrder> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const order = await client.order.create({
        data: {
          userId: newOrder.userId,
          deliveryAddress: newOrder.deliveryAddress,
          totalAmount: newOrder.totalAmount,
        },
      });

      return order;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async createOrderDetail(newOrderDetail: NewOrderDetail): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const orderDetail = await client.orderDetail.createMany({
        data: newOrderDetail.map((newOrderDetail) => {
          return {
            orderId: newOrderDetail.orderId,
            bookId: newOrderDetail.bookId,
            quantity: newOrderDetail.quantity,
            price: newOrderDetail.price,
          };
        }),
      });

      return orderDetail !== null;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async deleteCartByUserId(userId: bigint): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const cart = await client.cart.deleteMany({
        where: {
          userId,
        },
      });

      return true;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getUserSubscription(userId: bigint): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const userSubscription = await client.userSubscription.findFirst({
        where: {
          userId,
        },
      });

      return userSubscription;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getUserSubscriptionUsage(userSubscriptionId: bigint): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const userSubscriptionUsage = await client.userSubscriptionUsage.findFirst(
        {
          where: {
            userSubscriptionId,
          },
        },
      );

      return userSubscriptionUsage;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async updateUserSubscriptionUsage(
    userSubscriptionUsageId: bigint,
    noOfBookUploaded: number,
    priceDeposited: Decimal,
  ): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const userSubscriptionUsage = await client.userSubscriptionUsage.update({
        where: {
          id: userSubscriptionUsageId,
        },
        data: {
          noOfBookUploaded,
          priceDeposited,
          updatedAt: moment().format(),
        },
      });

      return userSubscriptionUsage !== null;
    } catch (error) {
      console.log(error);
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }
}
