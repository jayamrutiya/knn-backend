import { injectable } from 'inversify';
import { IDiscussionService } from '../interfaces/IDiscussionService';
import { ILoggerService } from '../interfaces/ILoggerService';
import BaseController from './BaseController';
import * as express from 'express';
import { NewDiscussion, UpdateDiscussion } from '../types/Discussion';
import ENV from '../config/env';

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
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
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

  async updateDiscussion(req: express.Request, res: express.Response) {
    try {
      const { question, createdBy, categoryId } = req.body;

      const updateDiscussion: UpdateDiscussion = {
        id: BigInt(req.params.id),
        titleImage: req.file
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
          : 'no image',
        question,
        createdBy: BigInt(createdBy),
        categoryId: BigInt(categoryId),
      };

      const discussion = await this._discussionService.updateDiscussion(
        updateDiscussion,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Discussion updated successfully',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getDiscussion(req: express.Request, res: express.Response) {
    try {
      const discussionId = BigInt(req.params.id);

      const discussion = await this._discussionService.getDiscussion(
        discussionId,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: 1,
        },
        discussion,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getAllDiscussion(req: express.Request, res: express.Response) {
    try {
      const discussion = await this._discussionService.getAllDiscussion();

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: discussion.length,
        },
        discussion,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async createAnswer(req: express.Request, res: express.Response) {
    try {
      const { discussionId, answeredBy, answer } = req.body;

      const discussionAnswer = await this._discussionService.createAnswer(
        BigInt(discussionId),
        BigInt(answeredBy),
        answer,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: 1,
        },
        discussionAnswer,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }
}
