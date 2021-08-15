import { injectable } from 'inversify';
import { IDiscussionService } from '../interfaces/IDiscussionService';
import { ILoggerService } from '../interfaces/ILoggerService';
import BaseController from './BaseController';
import * as express from 'express';
import { NewDiscussion } from '../types/Discussion';

@injectable()
export default class DiscussionController extends BaseController {
  private _loggerService: ILoggerService;

  private _discussionService: IDiscussionService;

  constructor(
    loggerService: ILoggerService,
    discussionService: IDiscussionService,
  ) {
    super();
    this._loggerService = loggerService;
    this._discussionService = discussionService;
    this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
  }

  async createDiscussion(req: express.Request, res: express.Response) {
    try {
      const { question, createdBy, categoryId } = req.body;

      const newDiscussion: NewDiscussion = {
        titleImage: req.file
          ? 'http://127.0.0.1:3000/images/' + req.file.filename
          : 'no image',
        question,
        createdBy: BigInt(createdBy),
        categoryId: BigInt(categoryId),
      };

      const discussion = await this._discussionService.creatDiscussion(
        newDiscussion,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Discussion created successfully',
        {
          length: 1,
        },
        discussion,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }
}
