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
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const InternalServerError_1 = require("../errors/InternalServerError");
const moment_1 = __importDefault(require("moment"));
const NotFound_1 = require("../errors/NotFound");
let UserRepository = class UserRepository {
    constructor(loggerService, databaseService) {
        this._loggerService = loggerService;
        this._databaseService = databaseService;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async createUser(newUser) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const user = await client.user.create({
                data: {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    userName: newUser.userName,
                    mobileNumber: newUser.mobileNumber,
                    emailId: newUser.emailId,
                    password: newUser.password,
                    salt: newUser.salt,
                    address: newUser.address,
                    city: newUser.city,
                    street: newUser.street,
                    createdAt: moment_1.default().format(),
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    userName: true,
                    mobileNumber: true,
                    emailId: true,
                    address: true,
                    city: true,
                    street: true,
                    isSuspended: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            return user;
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
    async getUserByUserName(userName) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const user = await client.user.findFirst({
                where: {
                    userName,
                    OR: {
                        emailId: userName,
                    },
                },
            });
            // if (user === null) {
            //   throw new NotFound(`User not found with userName ${userName}`);
            // }
            return user;
        }
        catch (error) {
            console.log(error);
            this._loggerService.getLogger().error(`Error ${error}`);
            // if (error instanceof NotFound) {
            //   throw error;
            // }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getUserByEmailId(emailId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const user = await client.user.findFirst({
                where: {
                    emailId,
                },
            });
            // if (user === null) {
            //   throw new NotFound(`User not found with userName ${userName}`);
            // }
            return user;
        }
        catch (error) {
            console.log(error);
            this._loggerService.getLogger().error(`Error ${error}`);
            // if (error instanceof NotFound) {
            //   throw error;
            // }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async setLastLogin(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const user = await client.user.update({
                where: {
                    id: userId,
                },
                data: {
                // lastLoginAt: moment().format(),
                },
            });
            return user !== null;
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
    async storeRefreshToken(userId, token) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const storeToken = await client.refreshToken.create({
                data: {
                    userId,
                    Token: token,
                },
            });
            return storeToken !== null;
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
    async getRereshToken(userId, refreshToken) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const token = await client.refreshToken.findFirst({
                where: {
                    userId,
                    Token: refreshToken,
                },
                select: {
                    id: false,
                    userId: true,
                    Token: true,
                    createdAt: false,
                },
            });
            if (token === null) {
                throw new NotFound_1.NotFound('Rfresh Token not found');
            }
            return token;
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
    async getUserById(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const user = await client.user.findFirst({
                where: {
                    id: userId,
                },
            });
            // if (user === null) {
            //   throw new NotFound(`User not found with userName ${userName}`);
            // }
            return user;
        }
        catch (error) {
            console.log(error);
            this._loggerService.getLogger().error(`Error ${error}`);
            // if (error instanceof NotFound) {
            //   throw error;
            // }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getCartByUserId(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const cart = await client.cart.findMany({
                where: {
                    userId,
                },
                select: {
                    id: true,
                    userId: true,
                    bookId: true,
                    quantity: true,
                    createdAt: true,
                    updatedAt: true,
                    Book: true,
                },
            });
            return cart;
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
    async addToCart(userId, bookId, quantity) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const cart = await client.cart.create({
                data: {
                    userId,
                    bookId,
                    quantity,
                },
            });
            return cart;
        }
        catch (error) {
            console.log(error);
            this._loggerService.getLogger().error(`Error ${error}`);
            // if (error instanceof NotFound) {
            //   throw error;
            // }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async createOrder(newOrder) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const order = await client.order.create({
                data: {
                    userId: newOrder.userId,
                    deliveryAddress: newOrder.deliveryAddress,
                    totalAmount: newOrder.totalAmount,
                },
            });
            return order;
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
    async createOrderDetail(newOrderDetail) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const orderDetail = await client.orderDetail.createMany({
                data: newOrderDetail.map((newOrderDetail) => {
                    return {
                        orderId: newOrderDetail.orderId,
                        bookId: newOrderDetail.bookId,
                        quantity: newOrderDetail.quantity,
                        price: newOrderDetail.price,
                    };
                }),
            });
            return orderDetail !== null;
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
    async deleteCartByUserId(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const cart = await client.cart.deleteMany({
                where: {
                    userId,
                },
            });
            return true;
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
    async getUserSubscription(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userSubscription = await client.userSubscription.findFirst({
                where: {
                    userId,
                },
            });
            return userSubscription;
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
    async getUserSubscriptionUsage(userSubscriptionId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userSubscriptionUsage = await client.userSubscriptionUsage.findFirst({
                where: {
                    userSubscriptionId,
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
    async updateUserSubscriptionUsage(userSubscriptionUsageId, noOfBookUploaded, priceDeposited) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userSubscriptionUsage = await client.userSubscriptionUsage.update({
                where: {
                    id: userSubscriptionUsageId,
                },
                data: {
                    noOfBookUploaded,
                    priceDeposited,
                    updatedAt: moment_1.default().format(),
                },
            });
            return userSubscriptionUsage !== null;
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
UserRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.DatabaseService))
], UserRepository);
exports.UserRepository = UserRepository;
