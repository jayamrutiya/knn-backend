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
        req.query.categoryType?.toString() === 'all'
          ? 'all'
          : req.query.categoryType?.toString() === 'BOOK'
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

  async createCategory(req: express.Request, res: express.Response) {
    try {
      const { name, type, createdBy } = req.body;

      const category = await this._categoryService.createCategory(
        name,
        type === 'BOOK' ? CategoryType['BOOK'] : CategoryType['DISCUSSION'],
        BigInt(createdBy),
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Category created successfully',
        null,
        category,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async deleteCategory(req: express.Request, res: express.Response) {
    try {
      const id = BigInt(req.params.id);
      const category = await this._categoryService.deleteCategory(id);

      // Return response
      return this.sendJSONResponse(
        res,
        category ? 'Category delete successfully' : 'Something went wrong',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }
}
