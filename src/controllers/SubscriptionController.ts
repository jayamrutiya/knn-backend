import express from 'express';
import { injectable } from 'inversify';
import { ILoggerService } from '../interfaces/ILoggerService';
import { ISubscriptionService } from '../interfaces/ISubscriptionService';
import BaseController from './BaseController';

@injectable()
export default class SubscriptionController extends BaseController {
  private _loggerService: ILoggerService;

  private _subscriptionService: ISubscriptionService;

  constructor(
    loggerService: ILoggerService,
    subscriptionService: ISubscriptionService,
  ) {
    super();
    this._loggerService = loggerService;
    this._subscriptionService = subscriptionService;
    this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
  }

  async getSubscription(req: express.Request, res: express.Response) {
    try {
      //ToDo: add validation
      // get parameter
      const subscriptionId = BigInt(req.params.id);

      const subscription = await this._subscriptionService.getSubscription(
        subscriptionId,
      );

      //return response

      return this.sendJSONResponse(
        res,
        null,
        {
          length: 1,
        },
        subscription,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getAllSubscription(req: express.Request, res: express.Response) {
    try {
      //ToDo: add validation

      const subscription = await this._subscriptionService.getAllSubscription();

      //return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: subscription.length,
        },
        subscription,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async userBuySubscription(req: express.Request, res: express.Response) {
    try {
      console.log('in userBuySubscription controller');
      // validate input
      this.validateRequest(req);
      const userId = BigInt(req.params.userId);
      const subscriptionId = BigInt(req.params.subscriptionId);

      const userSubscription = await this._subscriptionService.userBuySubscription(
        userId,
        subscriptionId,
      );

      //return response
      return this.sendJSONResponse(
        res,
        userSubscription
          ? 'User buy subscription successfully'
          : 'Somthing went wrong',
        null,
        null,
      );
    } catch (error) {
      console.log(error, 'err');

      return this.sendErrorResponse(req, res, error);
    }
  }
}
