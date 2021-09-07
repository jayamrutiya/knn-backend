import { CategoryType } from '@prisma/client';
import { GetCategory } from '../types/Category';

export interface ICategoryService {
  getCategories(categoryType: CategoryType): Promise<GetCategory[]>;
}
