import { Prisma } from '@prisma/client';

export declare type GetBookById = {
  id: bigint;
  bookName: string;
  authorId: bigint | null;
  isbn: string | null;
  pages: number | null;
  description: string | null;
  price: Prisma.Decimal;
  titleImage: string;
  createdBy: bigint;
  verifyBy: bigint | null;
  isActivated: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type GetBookAuthor = {
  id: bigint;
  name: string;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type createBook = {
  bookName: string;
  authorId: bigint | null;
  isbn: string | null;
  pages: number | null;
  description: string | null;
  price: Prisma.Decimal;
  titleImage: string;
  createdBy: bigint;
  verifyBy: bigint | null;
};

export declare type editBook = {
  id: bigint;
  bookName: string;
  authorId: bigint;
  isbn: string | null;
  pages: number | null;
  description: string | null;
  price: Prisma.Decimal;
  titleImage: string;
  stock: bigint;
  verifyBy: bigint | null;
  isActivated: boolean;
};

export declare type GetBookLikeDislike = {
  id: bigint;
  bookId: bigint;
  userId: bigint;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date | null;
} | null;

export declare type GetBookReview = {
  id: bigint;
  bookId: bigint;
  userId: bigint;
  review: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type GetBookRating = {
  id: bigint;
  bookId: bigint;
  userId: bigint;
  rating: number;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type GetBookCategory = {
  id: bigint;
  bookId: bigint;
  categoryId: bigint;
};
