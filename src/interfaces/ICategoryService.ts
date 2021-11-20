import { CategoryType } from '@prisma/client';
import { GetCategory } from '../types/Category';

export interface ICategoryService {
  getCategories(categoryType: CategoryType | 'all'): Promise<GetCategory[]>;

  createCategory(
    name: string,
    type: CategoryType,
    createdBy: bigint,
  ): Promise<any>;

  deleteCategory(id: bigint): Promise<any>;
}
