import { createBook, editBook, GetBookById } from '../types/Book';

export default interface IBookRepository {
  getBookById(bookId: bigint): Promise<GetBookById>;

  createBook(newBook: createBook): Promise<GetBookById | undefined>;

  getBookByNameAndAuthor(
    bookName: string,
    authorName: string,
  ): Promise<GetBookById | undefined | null>;

  updateBookStock(bookId: bigint, increment: boolean): Promise<boolean>;

  editBook(updateBook: editBook): Promise<boolean>;

  deleteBook(bookId: bigint): Promise<boolean>;
}
