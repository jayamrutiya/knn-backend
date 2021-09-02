import { Prisma } from '@prisma/client';

export declare type GetBookById = {
  id: bigint;
  bookName: string;
  authorName: string;
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

export declare type createBook = {
  bookName: string;
  authorName: string;
  isbn: string | null;
  pages: number | null;
  description: string | null;
  price: Prisma.Decimal;
  titleImage: string;
  createdBy: bigint;
};

export declare type editBook = {
  id: bigint;
  bookName: string;
  authorName: string;
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
