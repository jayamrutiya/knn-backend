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
exports.SubscriptionService = void 0;
const runtime_1 = require("@prisma/client/runtime");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const NotFound_1 = require("../errors/NotFound");
let SubscriptionService = class SubscriptionService {
    constructor(loggerService, subscriptionRepository, userRepository) {
        this._loggerService = loggerService;
        this._subscriptionRepository = subscriptionRepository;
        this._userRepository = userRepository;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async getSubscription(subscriptionId) {
        return this._subscriptionRepository.getSubscription(subscriptionId);
    }
    async getAllSubscription() {
        return this._subscriptionRepository.getAllSubscription();
    }
    async userBuySubscription(userId, subscriptionId) {
        const user = await this._userRepository.getUserById(userId);
        if (user) {
            const subscription = await this._subscriptionRepository.getSubscription(subscriptionId);
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
            const userSubscription = await this._subscriptionRepository.createUserSubscription(newUserSubscription);
            const newUserSubscriptionUsage = {
                noOfBookUploaded: 0,
                priceDeposited: new runtime_1.Decimal(0.0),
                userSubscriptionId: userSubscription.id,
            };
            const createUserSubscriptionUsage = await this._subscriptionRepository.createUserSubscriptionUsage(newUserSubscriptionUsage);
            return userSubscription !== null;
        }
        else {
            throw new NotFound_1.NotFound(`User not found with id ${userId}`);
        }
    }
};
SubscriptionService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.SubscriptionRepository)),
    __param(2, inversify_1.inject(types_1.TYPES.UserRepository))
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
