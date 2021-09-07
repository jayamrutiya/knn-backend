import {
  createBook,
  editBook,
  GetBookById,
  GetBookCategory,
  GetBookLikeDislike,
  GetBookRating,
  GetBookReview,
} from '../types/Book';

export interface IBookRepository {
  getBookById(bookId: bigint): Promise<GetBookById>;

  createBook(newBook: createBook): Promise<GetBookById | undefined>;

  createBookCategory(
    bookId: bigint,
    categoryId: bigint,
  ): Promise<GetBookCategory>;

  getBookByCategory(categoryId: bigint): Promise<any>;

  getBookByNameAndAuthor(
    bookName: string,
    authorName: string,
  ): Promise<GetBookById | undefined | null>;

  updateBookStock(bookId: bigint, increment: boolean): Promise<boolean>;

  editBook(updateBook: editBook): Promise<boolean>;

  deleteBook(bookId: bigint): Promise<boolean>;

  bookStatus(bookId: bigint, status: boolean): Promise<boolean>;

  doBookLikeDislike(
    bookId: bigint,
    userId: bigint,
    isLiked: boolean,
  ): Promise<boolean>;

  getBookLikeDislike(
    bookId: bigint,
    userId: bigint,
  ): Promise<GetBookLikeDislike>;

  updateBookLikeDislike(id: bigint, isLiked: boolean): Promise<boolean>;

  addBookReview(
    bookId: bigint,
    userId: bigint,
    review: string,
  ): Promise<GetBookReview>;

  addBookRating(
    userId: bigint,
    bookId: bigint,
    rating: number,
  ): Promise<boolean>;

  updateBookRating(id: bigint, rating: number): Promise<boolean>;

  getBookRating(userId: bigint, bookId: bigint): Promise<GetBookRating | null>;

  getAvgBookRating(bookId: bigint): Promise<{ rating: number | null }>;

  updateBookAvgRating(
    bookId: bigint,
    avgRating: number | null,
  ): Promise<boolean>;
}
