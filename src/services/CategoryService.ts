import { TYPES } from '../config/types';
import { ILoggerService } from '../interfaces/ILoggerService';
import { inject, injectable } from 'inversify';
import { ICategoryService } from '../interfaces/ICategoryService';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';
import { CategoryType } from '@prisma/client';
import { GetCategory } from '../types/Category';

@injectable()
export class CategoryService implements ICategoryService {
  private _loggerService: ILoggerService;

  private _categoryRepository: ICategoryRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.CategoryRepository) categoryRepository: ICategoryRepository,
  ) {
    this._loggerService = loggerService;
    this._categoryRepository = categoryRepository;

    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async getCategories(categoryType: CategoryType): Promise<GetCategory[]> {
    return this._categoryRepository.getCategories(categoryType);
  }
}
