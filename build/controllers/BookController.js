"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("./BaseController"));
const inversify_1 = require("inversify");
const env_1 = __importDefault(require("../config/env"));
const runtime_1 = require("@prisma/client/runtime");
let BookController = class BookController extends BaseController_1.default {
    constructor(loggerService, bookService) {
        super();
        this._loggerService = loggerService;
        this._bookService = bookService;
        this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
    }
    async getBookById(req, res) {
        try {
            const bookId = BigInt(req.params.id);
            const book = await this._bookService.getBookById(bookId);
            // Return response
            return this.sendJSONResponse(res, 'Book fetched successfully', {
                length: 1,
            }, book);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async createBook(req, res) {
        try {
            // get parameters
            const { bookName, authorId, authorName, isbn, pages, description, price, createdBy, verifyBy, } = req.body;
            const newBook = {
                bookName,
                authorId: authorId === '' ? null : BigInt(authorId),
                isbn,
                pages: pages === '' ? null : parseInt(pages),
                description,
                price: new runtime_1.Decimal(price),
                titleImage: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
                    : 'no image',
                createdBy: BigInt(createdBy),
                verifyBy: verifyBy != null || verifyBy != 'null' || verifyBy != undefined
                    ? BigInt(verifyBy)
                    : verifyBy,
            };
            console.log(newBook, 'newBook');
            const book = await this._bookService.createBook(newBook, authorName);
            // Return response
            return this.sendJSONResponse(res, 'Book created successfully', {
                length: 1,
            }, book);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async createBookCategory(req, res) {
        try {
            const bookId = BigInt(req.params.bookId);
            const categoryId = BigInt(req.params.categoryId);
            const bookCategoy = await this._bookService.createBookCategory(bookId, categoryId);
            // Return response
            return this.sendJSONResponse(res, 'Book Category created successfully', {
                length: 1,
            }, bookCategoy);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getBookByCategory(req, res) {
        try {
            const categoryId = BigInt(req.params.categoryId);
            let book = await this._bookService.getBookByCategory(categoryId);
            book = await book.map((data) => {
                delete data.BookAuthor;
                delete data.User;
                return {
                    ...data,
                };
            });
            // Return response
            return this.sendJSONResponse(res, null, {
                length: book.length,
            }, book);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getBooks(req, res) {
        try {
            let book = await this._bookService.getBooks();
            book = await book.map((data) => {
                delete data.BookAuthor;
                delete data.User;
                return {
                    ...data,
                };
            });
            // Return response
            return this.sendJSONResponse(res, null, {
                length: book.length,
            }, book);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getBookByNameAndAuthor(req, res) {
        try {
            // get parameters
            const bookName = req.body.bookName.toString();
            const author = req.body.author.toString();
            const book = await this._bookService.getBookByNameAndAuthor(bookName, author);
            // Return response
            return this.sendJSONResponse(res, 'Book fetched successfully', {
                length: 1,
            }, book);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async editBook(req, res) {
        try {
            // get parameters
            const { bookName, authorId, isbn, pages, description, price, stock, verifyBy, isActivated, } = req.body;
            const updateBook = {
                id: BigInt(req.params.id),
                bookName,
                authorId: BigInt(authorId),
                isbn,
                pages: parseInt(pages),
                description,
                price,
                titleImage: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
                    : 'no image',
                stock: BigInt(stock),
                verifyBy: BigInt(verifyBy),
                isActivated: isActivated == 'true' ? true : false,
            };
            console.log('updateBook ', updateBook);
            const book = await this._bookService.editBook(updateBook);
            // Return response
            return this.sendJSONResponse(res, 'Book update successfully', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async deleteBook(req, res) {
        try {
            const bookId = BigInt(req.params.id);
            const book = await this._bookService.deleteBook(bookId);
            // Return response
            return this.sendJSONResponse(res, 'Book delete successfully', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async bookStatus(req, res) {
        try {
            const bookId = BigInt(req.params.id);
            const status = req.query.status === 'true';
            console.log('status', req.query.status, status);
            const book = await this._bookService.bookStatus(bookId, status);
            // Return response
            return this.sendJSONResponse(res, status
                ? 'Book activated successfully'
                : 'Book deactivated successfully', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async doBookLikeDislike(req, res) {
        try {
            const { userId, bookId, isLiked } = req.body;
            const doBookLikeDisLike = await this._bookService.doBookLikeDislike(BigInt(userId), BigInt(bookId), isLiked);
            // Return response
            return this.sendJSONResponse(res, isLiked ? 'Book liked by' : 'Book disliked', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async addBookReview(req, res) {
        try {
            const { userId, bookId, review } = req.body;
            const bookReview = await this._bookService.addBookReview(BigInt(userId), BigInt(bookId), review);
            // Return response
            return this.sendJSONResponse(res, 'Book review added successfully', {
                length: 1,
            }, bookReview);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async createBookRating(req, res) {
        try {
            const { userId, bookId, rating } = req.body;
            const bookRating = await this._bookService.createBookRating(BigInt(userId), BigInt(bookId), parseFloat(rating));
            // Return response
            return this.sendJSONResponse(res, 'Book rating created successfully', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async tredingThisWeek(req, res) {
        try {
            // Return response
            return this.sendJSONResponse(res, null, null, await this._bookService.trendingThisWeek());
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async mostLovedBooks(req, res) {
        try {
            // Return response
            return this.sendJSONResponse(res, null, null, await this._bookService.mostLovedBooks());
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getBookAuthors(req, res) {
        try {
            // Return response
            return this.sendJSONResponse(res, null, null, await this._bookService.getBookAuthors());
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async deleteBookCategory(req, res) {
        try {
            const id = BigInt(req.params.id);
            // Return response
            return this.sendJSONResponse(res, (await this._bookService.deleteBookCategory(id))
                ? 'Deleted Successfully'
                : 'Error', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async createBookAuthor(req, res) {
        try {
            const name = req.body.name;
            const profile = req.file
                ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
                : 'no image';
            const authore = await this._bookService.createBookAuthor(name, profile);
            // Return response
            return this.sendJSONResponse(res, null, null, authore);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async deleteBookAuthor(req, res) {
        try {
            const id = BigInt(req.params.authorId);
            const author = await this._bookService.deleteBookAuthor(id);
            // Return response
            return this.sendJSONResponse(res, author ? 'Deleted Successfully' : 'Something went wrong', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
};
BookController = __decorate([
    inversify_1.injectable()
], BookController);
exports.default = BookController;
