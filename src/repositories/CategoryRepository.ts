import { TYPES } from '../config/types';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { inject, injectable } from 'inversify';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';
import { CategoryType } from '@prisma/client';
import { GetCategory } from '../types/Category';
import { InternalServerError } from '../errors/InternalServerError';

@injectable()
export class CategoryRepository implements ICategoryRepository {
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

  async getCategories(categoryType: CategoryType): Promise<GetCategory[]> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const category = await client.category.findMany({
        where: {
          type: categoryType,
        },
      });

      return category;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }
}
