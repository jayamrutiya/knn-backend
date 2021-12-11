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
exports.BookService = void 0;
const types_1 = require("../config/types");
const inversify_1 = require("inversify");
const BadRequest_1 = require("../errors/BadRequest");
const NotFound_1 = require("../errors/NotFound");
const fs_1 = __importDefault(require("fs"));
const env_1 = __importDefault(require("../config/env"));
let BookService = class BookService {
    constructor(loggerService, bookRepository, roleRepository, userRepository, subscriptionRepository) {
        this._loggerService = loggerService;
        this._bookRepository = bookRepository;
        this._roleRepository = roleRepository;
        this._userRepository = userRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async getBookById(bookId) {
        return this._bookRepository.getBookById(bookId);
    }
    async createBook(newBook, authorName) {
        // get user role
        const userRole = await this._roleRepository.getUserRole(newBook.createdBy);
        let book;
        if (userRole.Role === 'Member') {
            throw new BadRequest_1.BadRequest('User not have permission to create book');
        }
        // if (userRole.Role === 'User') {
        //   const userSubscription = await this._userRepository.getUserSubscription(
        //     newBook.createdBy,
        //   );
        //   const userSubscriptionUsage = await this._userRepository.getUserSubscriptionUsage(
        //     userSubscription.id,
        //   );
        //   const subscription = await this._subscriptionRepository.getSubscription(
        //     userSubscription.subscriptionId,
        //   );
        //   if (subscription.type === 'DEPOSITE') {
        //     throw new BadRequest('User not have permission to create book');
        //   }
        //   if (
        //     userSubscription.noOfBook === userSubscriptionUsage.noOfBookUploaded
        //   ) {
        //     throw new BadRequest('User not have permission to create book');
        //   }
        //   const findBookByName = await this._bookRepository.getBookByNameAndAuthor(
        //     newBook.bookName,
        //     authorName,
        //   );
        //   if (findBookByName === undefined || findBookByName === null) {
        //     book = await this._bookRepository.createBook(newBook);
        //   } else {
        //     // update stock
        //     await this._bookRepository.updateBookStock(findBookByName.id, true);
        //     book = findBookByName;
        //   }
        //   await this._userRepository.createUserBook(newBook.createdBy, book!.id);
        //   const totalBook = parseInt(userSubscriptionUsage.noOfBookUploaded) + 1;
        //   await this._userRepository.updateUserSubscriptionUsage(
        //     userSubscriptionUsage.id,
        //     totalBook,
        //     userSubscriptionUsage.priceDeposited,
        //   );
        //   // if (userSubscription.noOfBook === totalBook) {
        //   //   const getRoleId = await this._roleRepository.getRoleByName('Member');
        //   //   // const getUserRole = await this._roleRepository.getUserRole(
        //   //   //   newBook.createdBy,
        //   //   // );
        //   //   await this._roleRepository.updateUserRoler(getRoleId.id, userRole.id);
        //   // }
        // }
        if (userRole.Role === 'Platform Admin') {
            let getBookAuthor = null;
            if (newBook.authorId) {
                getBookAuthor = await this._bookRepository.getBookAuthorById(newBook.authorId);
            }
            newBook.verifyBy = newBook.createdBy;
            if (getBookAuthor === null) {
                throw new NotFound_1.NotFound('Author not found.');
            }
            // const findBookByName = await this._bookRepository.getBookByNameAndAuthor(
            //   newBook.bookName,
            //   getBookAuthor.name,
            // );
            // if (findBookByName === undefined || findBookByName === null) {
            book = await this._bookRepository.createBook(newBook);
            // } else {
            // update stock
            //   await this._bookRepository.updateBookStock(findBookByName.id, true);
            //   book = findBookByName;
            // }
            await this._userRepository.createUserBook(newBook.createdBy, book.id);
        }
        return book;
    }
    async createBookCategory(bookId, categoryId) {
        return this._bookRepository.createBookCategory(bookId, categoryId);
    }
    async getBookByCategory(categoryId) {
        return this._bookRepository.getBookByCategory(categoryId);
    }
    async getBooks() {
        return this._bookRepository.getBooks();
    }
    async getBookByNameAndAuthor(bookName, authorName) {
        return this._bookRepository.getBookByNameAndAuthor(bookName, authorName);
    }
    async editBook(updateBook) {
        const book = await this._bookRepository.getBookById(updateBook.id);
        if (updateBook.titleImage === 'no image') {
            updateBook.titleImage = book.titleImage;
        }
        else {
            await fs_1.default.unlinkSync(`${env_1.default.DIRECTORY}${book.titleImage.split(/images/)[1]}`);
        }
        return this._bookRepository.editBook(updateBook);
    }
    async deleteBook(bookId) {
        return this._bookRepository.deleteBook(bookId);
    }
    async bookStatus(bookId, status) {
        return this._bookRepository.bookStatus(bookId, status);
    }
    async doBookLikeDislike(bookId, userId, isLiked) {
        const user = await this._userRepository.getUserById(userId);
        if (user === null) {
            throw new NotFound_1.NotFound(`User not found with id ${userId}`);
        }
        await this._bookRepository.getBookById(bookId);
        const bookLikeDislike = await this._bookRepository.getBookLikeDislike(bookId, userId);
        if (bookLikeDislike !== null) {
            return this._bookRepository.updateBookLikeDislike(bookLikeDislike.id, isLiked);
        }
        return this._bookRepository.doBookLikeDislike(bookId, userId, isLiked);
    }
    async addBookReview(bookId, userId, review) {
        // comment
        const user = await this._userRepository.getUserById(userId);
        if (user === null) {
            throw new NotFound_1.NotFound(`User not found with id ${userId}`);
        }
        await this._bookRepository.getBookById(bookId);
        return this._bookRepository.addBookReview(bookId, userId, review);
    }
    async createBookRating(userId, bookId, rating) {
        const user = await this._userRepository.getUserById(userId);
        if (user === null) {
            throw new NotFound_1.NotFound(`User not found with id ${userId}`);
        }
        await this._bookRepository.getBookById(bookId);
        const bookRating = await this._bookRepository.getBookRating(userId, bookId);
        let bookrating;
        if (bookRating !== null) {
            bookrating = await this._bookRepository.updateBookRating(bookRating.id, rating);
        }
        bookrating = await this._bookRepository.addBookRating(userId, bookId, rating);
        const getAvgBookRating = await this._bookRepository.getAvgBookRating(bookId);
        const updateAvgBookRating = await this._bookRepository.updateBookAvgRating(bookId, getAvgBookRating.rating);
        return bookrating;
    }
    async trendingThisWeek() {
        return this._bookRepository.trendingThisWeek();
    }
    async mostLovedBooks() {
        return this._bookRepository.mostLovedBooks();
    }
    async getBookAuthors() {
        return this._bookRepository.getBookAuthors();
    }
    async deleteBookCategory(id) {
        return this._bookRepository.deleteBookCategory(id);
    }
    async createBookAuthor(name, profile) {
        return this._bookRepository.createBookAuthor(name, profile);
    }
    async deleteBookAuthor(id) {
        const author = await this._bookRepository.getBookAuthorById(id);
        if (author === null) {
            throw new NotFound_1.NotFound('Author not found');
        }
        if (author.profilePicture !== '' && author.profilePicture !== null) {
            await fs_1.default.unlinkSync(`${env_1.default.DIRECTORY}${author.profilePicture.split(/images/)[1]}`);
        }
        return this._bookRepository.deleteBookAuthor(id);
    }
};
BookService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.BookRepository)),
    __param(2, inversify_1.inject(types_1.TYPES.RoleRepository)),
    __param(3, inversify_1.inject(types_1.TYPES.UserRepository)),
    __param(4, inversify_1.inject(types_1.TYPES.SubscriptionRepository))
], BookService);
exports.BookService = BookService;
