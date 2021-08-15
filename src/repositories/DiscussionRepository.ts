import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFound } from '../errors/NotFound';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { IDiscussionRepository } from '../interfaces/IDiscussionRepository';
import { ILoggerService } from '../interfaces/ILoggerService';
import { GetDiscussion, NewDiscussion } from '../types/Discussion';

@injectable()
export class DiscussionRepository implements IDiscussionRepository {
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

  async creatDiscussion(newDiscussion: NewDiscussion): Promise<GetDiscussion> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const discussion = await client.discussion.create({
        data: {
          titleImage: newDiscussion.titleImage,
          question: newDiscussion.question,
          createdBy: newDiscussion.createdBy,
          categoryId: newDiscussion.categoryId,
        },
      });

      return discussion;
    } catch (error) {
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
}
