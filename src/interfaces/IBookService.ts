import {
  createBook,
  editBook,
  GetBookById,
  GetBookReview,
} from '../types/Book';

export interface IBookService {
  getBookById(bookId: bigint): Promise<GetBookById>;

  createBook(newBook: createBook): Promise<GetBookById | undefined>;

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
}
