import { CategoryType } from '@prisma/client';

export declare type GetCategory = {
  id: bigint;
  categoryName: string;
  description: string | null;
  createdBy: bigint;
  type: CategoryType;
  isActivated: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};
