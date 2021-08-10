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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const types_1 = require("../config/types");
const inversify_1 = require("inversify");
const BadRequest_1 = require("../errors/BadRequest");
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
    async createBook(newBook) {
        // get user role
        const userRole = await this._roleRepository.getUserRole(newBook.createdBy);
        let book;
        if (userRole.Role === 'Member') {
            throw new BadRequest_1.BadRequest('User not have permission to create book');
        }
        if (userRole.Role === 'User') {
            const userSubscription = await this._userRepository.getUserSubscription(newBook.createdBy);
            const userSubscriptionUsage = await this._userRepository.getUserSubscriptionUsage(userSubscription.id);
            const subscription = await this._subscriptionRepository.getSubscription(userSubscription.subscriptionId);
            if (subscription.type === 'DEPOSITE') {
                throw new BadRequest_1.BadRequest('User not have permission to create book');
            }
            if (userSubscription.noOfBook === userSubscriptionUsage.noOfBookUploaded) {
                throw new BadRequest_1.BadRequest('User not have permission to create book');
            }
            const findBookByName = await this._bookRepository.getBookByNameAndAuthor(newBook.bookName, newBook.authorName);
            if (findBookByName === undefined || findBookByName === null) {
                book = await this._bookRepository.createBook(newBook);
            }
            else {
                // update stock
                await this._bookRepository.updateBookStock(findBookByName.id, true);
                book = findBookByName;
            }
            const totalBook = parseInt(userSubscriptionUsage.noOfBookUploaded) + 1;
            await this._userRepository.updateUserSubscriptionUsage(userSubscriptionUsage.id, totalBook, userSubscriptionUsage.priceDeposited);
            if (userSubscription.noOfBook === totalBook) {
                const getRoleId = await this._roleRepository.getRoleByName('Member');
                // const getUserRole = await this._roleRepository.getUserRole(
                //   newBook.createdBy,
                // );
                await this._roleRepository.updateUserRoler(getRoleId.id, userRole.id);
            }
        }
        if (userRole.Role === 'Platform Admin') {
            const findBookByName = await this._bookRepository.getBookByNameAndAuthor(newBook.bookName, newBook.authorName);
            if (findBookByName === undefined || findBookByName === null) {
                book = await this._bookRepository.createBook(newBook);
            }
            else {
                // update stock
                await this._bookRepository.updateBookStock(findBookByName.id, true);
                book = findBookByName;
            }
        }
        return book;
    }
    async getBookByNameAndAuthor(bookName, authorName) {
        return this._bookRepository.getBookByNameAndAuthor(bookName, authorName);
    }
    async editBook(updateBook) {
        return this._bookRepository.editBook(updateBook);
    }
    async deleteBook(bookId) {
        return this._bookRepository.deleteBook(bookId);
    }
    async bookStatus(bookId, status) {
        return this._bookRepository.bookStatus(bookId, status);
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
