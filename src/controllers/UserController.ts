import * as express from 'express';
import BaseController from './BaseController';
import { inject, injectable } from 'inversify';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IUserService } from '../interfaces/IUserService';
import { CreateUser } from '../types/User';
import { Decimal } from '@prisma/client/runtime';

@injectable()
export default class UserController extends BaseController {
  private _loggerService: ILoggerService;

  private _userService: IUserService;

  constructor(loggerService: ILoggerService, userService: IUserService) {
    super();
    this._loggerService = loggerService;
    this._userService = userService;
    this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
  }

  async doesUserNameExist(req: express.Request, res: express.Response) {
    try {
      // validate input
      this.validateRequest(req);

      // Get parameter
      const userName =
        typeof req.query.userName === 'string' ? req.query.userName : '';

      // Check if email already present
      const inUse = await this._userService.getUserByUserName(userName);

      // Return the response
      return this.sendJSONResponse(
        res,
        null,
        {
          size: 1,
        },
        {
          code: inUse ? 'IN_USE' : 'AVAILABLE',
          message: inUse
            ? 'User name already in use.'
            : 'User name is available.',
        },
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async createUser(req: express.Request, res: express.Response) {
    try {
      // validate input
      this.validateRequest(req);

      // get parameters
      const {
        firstName,
        lastName,
        userName,
        mobileNumber,
        password,
        address,
        city,
        street,
      } = req.body;

      const newUser: CreateUser = {
        firstName,
        lastName,
        userName,
        mobileNumber,
        password,
        salt: '',
        address,
        city,
        street,
      };

      const user = await this._userService.createUser(newUser);

      // Return response
      return this.sendJSONResponse(
        res,
        'User created successfully',
        {
          length: 1,
        },
        user,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async addToCart(req: express.Request, res: express.Response) {
    try {
      console.log('in addToCart');

      // TODO: validate parameters

      const userId = BigInt(req.body.userId);
      const bookId = BigInt(req.body.bookId);
      const quantity = parseInt(req.body.quantity);

      const cart = await this._userService.addToCart(userId, bookId, quantity);

      // Return response
      return this.sendJSONResponse(
        res,
        'Added Successfully',
        {
          length: 1,
        },
        cart,
      );
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }

  async generateOrder(req: express.Request, res: express.Response) {
    try {
      // TODO: validate parameters

      const userId = BigInt(req.body.userId);
      const deliveryAddress = req.body.deliveryAddress.toString();
      const totalAmount = new Decimal(req.body.totalAmount);

      const order = await this._userService.generateOrder(
        userId,
        deliveryAddress,
        totalAmount,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Ordered Successfully',
        {
          length: 1,
        },
        order,
      );
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }
}
