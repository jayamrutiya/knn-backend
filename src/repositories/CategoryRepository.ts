import { TYPES } from '../config/types';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { inject, injectable } from 'inversify';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';
import { CategoryType } from '@prisma/client';
import { GetCategory } from '../types/Category';
import { InternalServerError } from '../errors/InternalServerError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { BadRequest } from '../errors/BadRequest';

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

  async getCategories(
    categoryType: CategoryType | 'all',
  ): Promise<GetCategory[]> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const category = await client.category.findMany({
        where:
          categoryType === 'all'
            ? {
                OR: [
                  {
                    type: 'BOOK',
                  },
                  {
                    type: 'DISCUSSION',
                  },
                ],
              }
            : {
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

  async createCategory(
    name: string,
    type: CategoryType,
    createdBy: bigint,
  ): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const category = await client.category.create({
        data: {
          categoryName: name,
          type,
          isActivated: true,
          createdBy,
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

  async deleteCategory(id: bigint): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const category = await client.category.delete({
        where: {
          id,
        },
      });

      return category !== null;
    } catch (error) {
      console.log('Error: ', error);

      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequest('This category assign to somewhere');
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }
}
