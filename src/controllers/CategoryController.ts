import { ICategoryService } from '../interfaces/ICategoryService';
import { ILoggerService } from '../interfaces/ILoggerService';
import BaseController from './BaseController';
import { injectable } from 'inversify';
import * as express from 'express';
import { CategoryType } from '@prisma/client';

@injectable()
export default class CategoryController extends BaseController {
  private _loggerService: ILoggerService;

  private _categoryService: ICategoryService;

  constructor(
    loggerService: ILoggerService,
    categoryService: ICategoryService,
  ) {
    super();
    this._loggerService = loggerService;
    this._categoryService = categoryService;
    this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
  }

  async getCategories(req: express.Request, res: express.Response) {
    try {
      const categoryType =
        req.query.categoryType?.toString() === 'BOOK'
          ? CategoryType['BOOK']
          : CategoryType['DISCUSSION'];

      const category = await this._categoryService.getCategories(categoryType);

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: category.length,
        },
        category,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }
}
