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
let BookController = class BookController extends BaseController_1.default {
    constructor(loggerService, bookService) {
        super();
        this._loggerService = loggerService;
        this._bookService = bookService;
        this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
    }
    async createBook(req, res) {
        try {
            // get parameters
            const { bookName, authorName, isbn, pages, description, price, createdBy, } = req.body;
            const newBook = {
                bookName,
                authorName,
                isbn,
                pages: parseInt(pages),
                description,
                price,
                titleImage: req.file
                    ? 'http://127.0.0.1:3000/images/' + req.file.filename
                    : 'no image',
                createdBy: BigInt(createdBy),
            };
            console.log(newBook, 'newBook');
            const book = await this._bookService.createBook(newBook);
            // Return response
            return this.sendJSONResponse(res, 'Book created successfully', {
                length: 1,
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
            const { bookName, authorName, isbn, pages, description, price, stock, verifyBy, isActivated, } = req.body;
            const updateBook = {
                id: BigInt(req.params.id),
                bookName,
                authorName,
                isbn,
                pages: parseInt(pages),
                description,
                price,
                titleImage: req.file
                    ? 'http://127.0.0.1:3000/images/' + req.file.filename
                    : 'no image',
                stock: BigInt(stock),
                verifyBy: BigInt(verifyBy),
                isActivated: isActivated == 'true' ? true : false,
            };
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
};
BookController = __decorate([
    inversify_1.injectable()
], BookController);
exports.default = BookController;
