import * as express from 'express';
import BaseController from './BaseController';
import { inject, injectable } from 'inversify';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IUserService } from '../interfaces/IUserService';
import { CreateUser, UpdateUser } from '../types/User';
import { Decimal } from '@prisma/client/runtime';
import ENV from '../config/env';
import { OrderStatus } from '.prisma/client';
import { BadRequest } from '../errors/BadRequest';

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
        emailId,
        mobileNumber,
        password,
        address,
        city,
        street,
      } = req.body;

      const newUser: CreateUser = {
        firstName,
        lastName,
        profilePicture: req.file
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
          : null,
        userName,
        emailId,
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

  async getCartByUserId(req: express.Request, res: express.Response) {
    try {
      console.log('getCartByUserId');

      // TODO: validate parameters

      const userId = BigInt(req.params.userId);

      const cart = await this._userService.getCartByUserId(userId);

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: cart.length,
        },
        cart,
      );
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }

  async deleteCartItem(req: express.Request, res: express.Response) {
    try {
      console.log('in deleteCartItem');

      // TODO: validate parameters

      const cartItemId = BigInt(req.params.id);

      const cart = await this._userService.deleteCartItem(cartItemId);

      // Return response
      return this.sendJSONResponse(
        res,
        cart ? 'Delete Successfully' : 'Something went wrong',
        null,
        null,
      );
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }

  async generateOrder(req: express.Request, res: express.Response) {
    try {
      // TODO: validate parameters

      console.log('body', req.body);

      const userId = BigInt(req.body.userId);
      const {
        firstName,
        lastName,
        emailId,
        mobileNumber,
        deliveryAddress,
      } = req.body;
      // const deliveryAddress = req.body.deliveryAddress.toString();
      const totalAmount = new Decimal(req.body.totalAmount);

      const order = await this._userService.generateOrder(
        userId,
        firstName,
        lastName,
        emailId,
        mobileNumber,
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

  async verifyUser(req: express.Request, res: express.Response) {
    try {
      const { userId, isVerify } = req.body;

      const userVerify = await this._userService.verifyUser(
        BigInt(userId),
        isVerify,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        isVerify ? 'User verifed successfully' : 'User not verifed',
        null,
        null,
      );
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }

  async getUser(req: express.Request, res: express.Response) {
    try {
      const userId = req.params.userId;

      const user = await this._userService.getUser(BigInt(userId));

      // Return response
      return this.sendJSONResponse(res, null, null, user);
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }

  async getUserWithCount(req: express.Request, res: express.Response) {
    try {
      const userId = req.params.userId;

      const user = await this._userService.getUserWithCount(BigInt(userId));

      // Return response
      return this.sendJSONResponse(res, null, null, user);
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }

  async updateUser(req: express.Request, res: express.Response) {
    try {
      console.log(req.file);

      // get parameters
      const { firstName, mobileNumber, address } = req.body;

      const updateUser: UpdateUser = {
        id: BigInt(req.params.id),
        firstName,
        profilePicture: req.file
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/Profile/${req.file.filename}`
          : null,
        mobileNumber,
        address,
      };

      const user = await this._userService.updateUser(updateUser);

      // Return response
      return this.sendJSONResponse(res, null, null, user);
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }

  async newUser(req: express.Request, res: express.Response) {
    try {
      const isVerify = req.query.isVerify === 'true';
      // Return response
      return this.sendJSONResponse(
        res,
        null,
        null,
        await this._userService.newusers(isVerify),
      );
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }

  async getOrder(req: express.Request, res: express.Response) {
    try {
      let status;
      if (req.query.status === 'PENDING') {
        status = OrderStatus['PENDING'];
      } else if (req.query.status === 'DELIVERED') {
        status = OrderStatus['DELIVERED'];
      } else if (req.query.status === 'ONTHEWAY') {
        status = OrderStatus['ONTHEWAY'];
      } else if (req.query.status === 'CANCLE') {
        status = OrderStatus['CANCLE'];
      } else {
        throw new BadRequest('This is not valid status');
      }
      // Return response
      return this.sendJSONResponse(
        res,
        null,
        null,
        await this._userService.getOrder(status),
      );
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }

  async orderStatusChange(req: express.Request, res: express.Response) {
    try {
      let status;
      if (req.query.status === 'PENDING') {
        status = OrderStatus['PENDING'];
      } else if (req.query.status === 'DELIVERED') {
        status = OrderStatus['DELIVERED'];
      } else if (req.query.status === 'ONTHEWAY') {
        status = OrderStatus['ONTHEWAY'];
      } else if (req.query.status === 'CANCLE') {
        status = OrderStatus['CANCLE'];
      } else {
        throw new BadRequest('This is not valid status');
      }
      const id = BigInt(req.params.orderId);

      const order = await this._userService.orderStatusChange(id, status);
      // Return response
      return this.sendJSONResponse(res, 'Order Status chanaged.', null, null);
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }

  async getOrderById(req: express.Request, res: express.Response) {
    try {
      const id = BigInt(req.params.id);

      const order = await this._userService.getOrderById(id);

      // Return response
      return this.sendJSONResponse(res, null, null, order);
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }
}
