import { createBook, editBook, GetBookById } from '../types/Book';

export interface IBookService {
  getBookById(bookId: bigint): Promise<GetBookById>;

  createBook(newBook: createBook): Promise<GetBookById | undefined>;

  getBookByNameAndAuthor(
    bookName: string,
    authorName: string,
  ): Promise<GetBookById | undefined | null>;

  editBook(updateBook: editBook): Promise<boolean>;

  deleteBook(bookId: bigint): Promise<boolean>;
}
