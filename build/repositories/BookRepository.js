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
    async getBookByNameAndAuthor(bookName, authorName) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const book = await client.book.findFirst({
                where: {
                    bookName,
                    authorName,
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
    async createBook(newBook) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            return await client.book.create({
                data: {
                    bookName: newBook.bookName,
                    authorName: newBook.authorName,
                    isbn: newBook.isbn,
                    pages: newBook.pages,
                    description: newBook.description,
                    price: newBook.price,
                    titleImage: newBook.titleImage,
                    createdBy: newBook.createdBy,
                },
            });
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
                    authorName: updateBook.authorName,
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
};
BookRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.DatabaseService))
], BookRepository);
exports.BookRepository = BookRepository;
