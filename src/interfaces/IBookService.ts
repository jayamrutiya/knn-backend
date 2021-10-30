import {
  createBook,
  editBook,
  GetBookById,
  GetBookCategory,
  GetBookReview,
} from '../types/Book';

export interface IBookService {
  getBookById(bookId: bigint): Promise<GetBookById>;

  createBook(
    newBook: createBook,
    authorName: string,
  ): Promise<GetBookById | undefined>;

  createBookCategory(
    bookId: bigint,
    categoryId: bigint,
  ): Promise<GetBookCategory>;

  getBookByCategory(categoryId: bigint): Promise<any>;

  getBookByNameAndAuthor(
    bookName: string,
    authorName: string,
  ): Promise<GetBookById | undefined | null>;

  editBook(updateBook: editBook): Promise<boolean>;

  deleteBook(bookId: bigint): Promise<boolean>;

  bookStatus(bookId: bigint, status: boolean): Promise<boolean>;

  doBookLikeDislike(
    bookId: bigint,
    userId: bigint,
    isLiked: boolean,
  ): Promise<boolean>;

  addBookReview(
    bookId: bigint,
    userId: bigint,
    review: string,
  ): Promise<GetBookReview>;

  createBookRating(
    userId: bigint,
    bookId: bigint,
    rating: number,
  ): Promise<boolean>;

  trendingThisWeek(): Promise<any>;

  mostLovedBooks(): Promise<any>;
}
