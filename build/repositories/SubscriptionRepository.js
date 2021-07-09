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
exports.SubscriptionRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const InternalServerError_1 = require("../errors/InternalServerError");
const NotFound_1 = require("../errors/NotFound");
let SubscriptionRepository = class SubscriptionRepository {
    constructor(loggerService, databaseService) {
        this._loggerService = loggerService;
        this._databaseService = databaseService;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async getSubscription(subscriptionId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const subscription = await client.subscription.findFirst({
                where: {
                    id: subscriptionId,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    type: true,
                    noOfBook: true,
                    deposite: true,
                    price: true,
                    createdAt: false,
                    createdBy: false,
                    updatedAt: false,
                },
            });
            if (subscription === null) {
                throw new NotFound_1.NotFound(`subscription not found with id ${subscriptionId}`);
            }
            return subscription;
        }
        catch (error) {
            console.log(error);
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
    async getAllSubscription() {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const subscription = await client.subscription.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    type: true,
                    noOfBook: true,
                    deposite: true,
                    price: true,
                    createdAt: false,
                    createdBy: false,
                    updatedAt: false,
                },
            });
            return subscription;
        }
        catch (error) {
            console.log(error);
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async createUserSubscription(newUserSubscription) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const createUserSubscription = await client.userSubscription.create({
                data: {
                    subscriptionId: newUserSubscription.subscriptionId,
                    userId: newUserSubscription.userId,
                    title: newUserSubscription.title,
                    description: newUserSubscription.description,
                    type: newUserSubscription.type,
                    noOfBook: newUserSubscription.noOfBook,
                    price: newUserSubscription.price,
                    deposite: newUserSubscription.deposite,
                },
            });
            return createUserSubscription;
        }
        catch (error) {
            console.log(error);
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async createUserSubscriptionUsage(newUserSubscriptionUsage) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userSubscriptionUsage = await client.userSubscriptionUsage.create({
                data: {
                    userSubscriptionId: newUserSubscriptionUsage.userSubscriptionId,
                    noOfBookUploaded: newUserSubscriptionUsage.noOfBookUploaded,
                    priceDeposited: newUserSubscriptionUsage.priceDeposited,
                },
            });
            return userSubscriptionUsage;
        }
        catch (error) {
            console.log(error);
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
};
SubscriptionRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.DatabaseService))
], SubscriptionRepository);
exports.SubscriptionRepository = SubscriptionRepository;
