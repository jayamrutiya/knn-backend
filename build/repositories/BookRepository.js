"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRepository = void 0;
const types_1 = require("../config/types");
const inversify_1 = require("inversify");
const NotFound_1 = require("../errors/NotFound");
const InternalServerError_1 = require("../errors/InternalServerError");
const moment_1 = __importDefault(require("moment"));
const runtime_1 = require("@prisma/client/runtime");
const BadRequest_1 = require("../errors/BadRequest");
let BookRepository = class BookRepository {
    constructor(loggerService, databaseService) {
        this._loggerService = loggerService;
        this._databaseService = databaseService;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async getBookById(bookId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const book = await client.book.findFirst({
                where: {
                    id: bookId,
                },
                include: {
                    BookCategory: {
                        select: {
                            id: true,
                            Category: true,
                        },
                    },
                    BookAuthor: true,
                    BookReview: true,
                    BookLikeDislike: {
                        where: {
                            isLiked: true,
                        },
                    },
                },
            });
            if (book === null) {
                throw new NotFound_1.NotFound(`Book not found with bookId ${bookId}`);
            }
            return book;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getBooks() {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const book = await client.book.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    bookName: true,
                    titleImage: true,
                    isbn: true,
                    avgRating: true,
                    price: true,
                    stock: true,
                    isActivated: true,
                    BookAuthor: {
                        select: {
                            name: true,
                        },
                    },
                    User: {
                        select: {
                            UserRole: {
                                select: {
                                    Role: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            console.log('book', book);
            const bookDetails = await book.map((d) => {
                return {
                    ...d,
                    authorName: d.BookAuthor ? d.BookAuthor.name : null,
                    createdBy: d.User.UserRole[0].Role.name === 'Member' ||
                        d.User.UserRole[0].Role.name === 'User'
                        ? 'User'
                        : 'Platform Admin',
                };
            });
            return bookDetails;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getBookByCategory(categoryId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const book = await client.bookCategory.findMany({
                orderBy: {
                    bookId: 'desc',
                },
                where: categoryId !== 0n
                    ? {
                        categoryId,
                        Book: {
                            isActivated: true,
                        },
                    }
                    : {
                        Book: {
                            isActivated: true,
                        },
                    },
                select: {
                    Category: {
                        select: {
                            categoryName: true,
                        },
                    },
                    Book: {
                        select: {
                            id: true,
                            bookName: true,
                            titleImage: true,
                            isbn: true,
                            avgRating: true,
                            price: true,
                            stock: true,
                            isActivated: true,
                            BookAuthor: {
                                select: {
                                    name: true,
                                },
                            },
                            User: {
                                select: {
                                    UserRole: {
                                        select: {
                                            Role: {
                                                select: {
                                                    name: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            console.log('book', book);
            const bookDetails = await book.map((d) => {
                return {
                    ...d.Book,
                    categoryName: d.Category.categoryName,
                    authorName: d.Book.BookAuthor ? d.Book.BookAuthor.name : null,
                    createdBy: d.Book.User.UserRole[0].Role.name === 'Member' ||
                        d.Book.User.UserRole[0].Role.name === 'User'
                        ? 'User'
                        : 'Platform Admin',
                };
            });
            return bookDetails;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getBookByNameAndAuthor(bookName, authorName) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const book = await client.book.findFirst({
                where: {
                    bookName,
                    BookAuthor: {
                        name: authorName,
                    },
                },
            });
            return book;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getBookAuthorById(id) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookAuthor = await client.bookAuthor.findFirst({
                where: {
                    id,
                },
            });
            return bookAuthor;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async createBook(newBook) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            return await client.book.create({
                data: {
                    bookName: newBook.bookName,
                    authorId: newBook.authorId,
                    isbn: newBook.isbn,
                    pages: newBook.pages,
                    description: newBook.description,
                    price: newBook.price,
                    titleImage: newBook.titleImage,
                    createdBy: newBook.createdBy,
                    verifyBy: newBook.verifyBy,
                },
            });
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async createBookCategory(bookId, categoryId) {
        try {
            const client = this._databaseService.Client();
            const bookCategory = await client.bookCategory.create({
                data: {
                    bookId,
                    categoryId,
                },
            });
            return bookCategory;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async updateBookStock(bookId, increment) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const book = await client.book.update({
                where: {
                    id: bookId,
                },
                data: {
                    stock: increment
                        ? {
                            increment: 1,
                        }
                        : {
                            decrement: 1,
                        },
                },
            });
            return book !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async editBook(updateBook) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const book = await client.book.update({
                where: {
                    id: updateBook.id,
                },
                data: {
                    bookName: updateBook.bookName,
                    authorId: updateBook.authorId,
                    isbn: updateBook.isbn,
                    pages: updateBook.pages,
                    description: updateBook.description,
                    price: updateBook.price,
                    titleImage: updateBook.titleImage,
                    stock: updateBook.stock,
                    verifyBy: updateBook.verifyBy,
                    isActivated: updateBook.isActivated,
                    updatedAt: moment_1.default().format(),
                },
            });
            if (book == undefined || book == null) {
                throw new NotFound_1.NotFound(`Book not found with id ${updateBook.id}`);
            }
            return book !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async deleteBook(bookId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userBook = await client.userBook.deleteMany({
                where: {
                    bookId,
                },
            });
            const bookCategory = await client.bookCategory.deleteMany({
                where: {
                    bookId,
                },
            });
            const book = await client.book.delete({
                where: {
                    id: bookId,
                },
            });
            if (book == undefined || book == null) {
                throw new NotFound_1.NotFound(`Book not found with id ${bookId}`);
            }
            return book !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async bookStatus(bookId, status) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const book = await client.book.update({
                where: {
                    id: bookId,
                },
                data: {
                    isActivated: status,
                },
            });
            return book !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async doBookLikeDislike(bookId, userId, isLiked) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookLikeDislike = await client.bookLikeDislike.create({
                data: {
                    bookId,
                    userId,
                    isLiked,
                },
            });
            return bookLikeDislike !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getBookLikeDislike(bookId, userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookLikeDislike = await client.bookLikeDislike.findFirst({
                where: {
                    bookId,
                    userId,
                },
            });
            return bookLikeDislike;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async updateBookLikeDislike(id, isLiked) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookLikeDislike = await client.bookLikeDislike.update({
                where: {
                    id,
                },
                data: {
                    isLiked,
                    updatedAt: moment_1.default().format(),
                },
            });
            return bookLikeDislike !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async addBookReview(bookId, userId, review) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookReview = await client.bookReview.create({
                data: {
                    bookId,
                    userId,
                    review,
                },
            });
            return bookReview;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async addBookRating(userId, bookId, rating) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookRating = await client.bookRating.create({
                data: {
                    userId,
                    bookId,
                    rating,
                },
            });
            return bookRating !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async updateBookRating(id, rating) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookRating = await client.bookRating.update({
                where: {
                    id,
                },
                data: {
                    rating,
                },
            });
            return bookRating !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getBookRating(userId, bookId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookRating = await client.bookRating.findFirst({
                where: {
                    userId,
                    bookId,
                },
            });
            return bookRating;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getAvgBookRating(bookId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookAvgRating = await client.bookRating.aggregate({
                _avg: {
                    rating: true,
                },
            });
            console.log(bookAvgRating);
            return bookAvgRating._avg;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async updateBookAvgRating(bookId, avgRating) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const book = await client.book.update({
                where: {
                    id: bookId,
                },
                data: {
                    avgRating,
                    updatedAt: moment_1.default().format(),
                },
            });
            return book !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async trendingThisWeek() {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const currentDate = moment_1.default().format();
            const pastDate = moment_1.default().subtract(7, 'days').format();
            const book = await client.orderDetail.findMany({
                where: {
                    Order: {
                        status: 'DELIVERED',
                    },
                    Book: {
                        isActivated: true,
                    },
                    createdAt: {
                        gte: pastDate,
                        lt: currentDate,
                    },
                },
                take: 4,
                select: {
                    Book: {
                        select: {
                            id: true,
                            bookName: true,
                            price: true,
                            titleImage: true,
                            avgRating: true,
                            BookCategory: {
                                select: {
                                    Category: {
                                        select: {
                                            categoryName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            const responseData = await book.map((d) => {
                return {
                    id: d.Book.id,
                    bookName: d.Book.bookName,
                    price: d.Book.price,
                    titleImage: d.Book.titleImage,
                    categoryName: d.Book.BookCategory[0].Category.categoryName,
                };
            });
            return responseData;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async mostLovedBooks() {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const book = await client.book.findMany({
                where: {
                    isActivated: true,
                    avgRating: {
                        gte: 2.5,
                    },
                },
                take: 10,
                include: {
                    BookCategory: {
                        select: {
                            Category: {
                                select: {
                                    categoryName: true,
                                },
                            },
                        },
                    },
                    BookAuthor: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            const responseData = await book.map((d) => {
                return {
                    id: d.id,
                    titleImage: d.titleImage,
                    avgRating: d.avgRating,
                    bookName: d.bookName,
                    price: d.price,
                    categoryName: d.BookCategory[0].Category.categoryName,
                    authorName: d.BookAuthor?.name,
                };
            });
            return responseData;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async createBookAuthor(name, profile) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookAuthore = await client.bookAuthor.create({
                data: {
                    name,
                    profilePicture: profile,
                },
            });
            return bookAuthore;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getBookByCreateBy(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userBook = await client.userBook.findMany({
                where: {
                    userId,
                },
                include: {
                    Book: {
                        include: {
                            BookAuthor: true,
                        },
                    },
                },
            });
            return userBook;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getBookAuthors() {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookAuthor = await client.bookAuthor.findMany({});
            return bookAuthor;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async deleteBookCategory(id) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookCat = await client.bookCategory.delete({
                where: {
                    id,
                },
            });
            return bookCat !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async deleteBookAuthor(id) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookAuthore = await client.bookAuthor.delete({
                where: {
                    id,
                },
            });
            return bookAuthore !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof runtime_1.PrismaClientKnownRequestError) {
                throw new BadRequest_1.BadRequest('This author assign to somewhere');
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
};
BookRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.DatabaseService))
], BookRepository);
exports.BookRepository = BookRepository;
