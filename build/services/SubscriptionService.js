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
exports.SubscriptionService = void 0;
const runtime_1 = require("@prisma/client/runtime");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const BadRequest_1 = require("../errors/BadRequest");
const NotFound_1 = require("../errors/NotFound");
const env_1 = __importDefault(require("../config/env"));
const express_1 = __importDefault(require("../config/express"));
const events_1 = require("../config/events");
let SubscriptionService = class SubscriptionService {
    constructor(loggerService, subscriptionRepository, userRepository, bookRepository, jwtService, roleRepository) {
        this._loggerService = loggerService;
        this._subscriptionRepository = subscriptionRepository;
        this._userRepository = userRepository;
        this._bookRepository = bookRepository;
        this._jwtService = jwtService;
        this._roleRepository = roleRepository;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async getSubscription(subscriptionId) {
        return this._subscriptionRepository.getSubscription(subscriptionId);
    }
    async getAllSubscription() {
        return this._subscriptionRepository.getAllSubscription();
    }
    async userBuySubscription(userSubscription) {
        const user = await this._userRepository.getUserById(userSubscription.userId);
        if (user) {
            if (user.isSubscriptionComplete) {
                throw new BadRequest_1.BadRequest('You alredy complete you subscription process. Wait for admin confirmation.');
            }
            const subscription = await this._subscriptionRepository.getSubscription(userSubscription.subscriptionId);
            if (subscription.type === 'BOOK') {
                for (let i = 0; i < subscription.noOfBook; i++) {
                    const findBookByName = await this._bookRepository.getBookByNameAndAuthor(userSubscription.bookName[i], userSubscription.authorName[i]);
                    let book;
                    if (findBookByName === undefined || findBookByName === null) {
                        const bookAuthor = await this._bookRepository.createBookAuthor(userSubscription.authorName[i], '');
                        book = await this._bookRepository.createBook({
                            bookName: userSubscription.bookName[i],
                            price: new runtime_1.Decimal(25.0),
                            titleImage: userSubscription.titleImage[i],
                            createdBy: userSubscription.userId,
                            authorId: bookAuthor.id,
                            isbn: null,
                            description: null,
                            pages: null,
                            verifyBy: null,
                        });
                    }
                    else {
                        // update stock
                        // await this._bookRepository.updateBookStock(findBookByName.id, true);
                        book = findBookByName;
                    }
                    await this._userRepository.createUserBook(userSubscription.userId, book.id);
                }
            }
            const newUserSubscription = {
                subscriptionId: subscription.id,
                userId: user.id,
                title: subscription.title,
                description: subscription.description,
                type: subscription.type,
                noOfBook: subscription.noOfBook,
                price: subscription.price,
                deposite: subscription.deposite,
            };
            const userNewSubscription = await this._subscriptionRepository.createUserSubscription(newUserSubscription);
            const newUserSubscriptionUsage = {
                noOfBookUploaded: subscription.type === 'BOOK' ? subscription.noOfBook : 0,
                priceDeposited: subscription.type === 'DEPOSITE'
                    ? subscription.deposite
                    : new runtime_1.Decimal(0.0),
                userSubscriptionId: userNewSubscription.id,
            };
            const createUserSubscriptionUsage = await this._subscriptionRepository.createUserSubscriptionUsage(newUserSubscriptionUsage);
            await this._userRepository.doneSubscriptionProcess(userSubscription.userId, true);
            const userRole = await this._roleRepository.getUserRole(user.id);
            const accessToken = this._jwtService.generateToken(userRole, env_1.default.ACCESS_TOKEN_SECRET, env_1.default.ACCESS_TOKEN_EXPIRES_IN);
            // Create a Refresh token
            const refreshToken = this._jwtService.generateToken(userRole, env_1.default.REFRESH_TOKEN_SECRET, env_1.default.REFRESH_TOKEN_EXPIRES_IN);
            await this._userRepository.storeRefreshToken(user.id, refreshToken);
            // send email
            express_1.default.emit(events_1.EventTypes.SEND_COMMON_EMAIL, {
                subject: 'Knn - Buy Subscription',
                body: `<p>You Subscription process is complete please wait for admin confirmation.</p>`,
                emailId: user.emailId,
            });
            // Return token
            return { accessToken, refreshToken };
        }
        else {
            throw new NotFound_1.NotFound(`User not found with id ${userSubscription.userId}`);
        }
    }
};
SubscriptionService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.SubscriptionRepository)),
    __param(2, inversify_1.inject(types_1.TYPES.UserRepository)),
    __param(3, inversify_1.inject(types_1.TYPES.BookRepository)),
    __param(4, inversify_1.inject(types_1.TYPES.JwtService)),
    __param(5, inversify_1.inject(types_1.TYPES.RoleRepository))
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
