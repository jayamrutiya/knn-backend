import express from 'express';
import { injectable } from 'inversify';
import { ILoggerService } from '../interfaces/ILoggerService';
import { ISubscriptionService } from '../interfaces/ISubscriptionService';
import BaseController from './BaseController';
import ENV from '../config/env';

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
      console.log('in userBuySubscription controller', req.body.bookName);
      // validate input
      // this.validateRequest(req);
      console.log('files', req.files);
      const files: any = req.files;
      const fileData = [];
      if (req.files) {
        for (let i = 0; i < files.length; i++) {
          fileData.push(
            `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${files[i].filename}`,
          );
        }
      }

      const { bookName, authorName, userId, subscriptionId } = req.body;

      const userSubscription = {
        bookName: bookName.map((book: any) => book.toString().toLowerCase()),
        authorName: authorName.map((authore: any) =>
          authore.toString().toLowerCase(),
        ),
        titleImage: fileData,
        userId: BigInt(userId),
        subscriptionId: BigInt(subscriptionId),
      };

      console.log('userSubscription', userSubscription);

      const usersubscription = await this._subscriptionService.userBuySubscription(
        userSubscription,
      );

      //return response
      return this.sendJSONResponse(
        res,
        usersubscription
          ? 'User buy subscription successfully'
          : 'Somthing went wrong',
        null,
        usersubscription,
      );
    } catch (error) {
      console.log(error, 'err');

      return this.sendErrorResponse(req, res, error);
    }
  }
}
