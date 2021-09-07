import { CategoryType } from '@prisma/client';
import { GetCategory } from '../types/Category';

export interface ICategoryRepository {
  getCategories(categoryType: CategoryType): Promise<GetCategory[]>;
}
