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
                    profilePicture: newUser.profilePicture,
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
                    profilePicture: true,
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
            console.log(userName);
            // Get the database client
            const client = this._databaseService.Client();
            const user = await client.user.findFirst({
                where: {
                    OR: [
                        {
                            userName,
                        },
                        {
                            emailId: userName,
                        },
                    ],
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
    async saveForgotPassword(userId, emailId, nonce) {
        try {
            // get the database client
            const client = this._databaseService.Client();
            // Store forgot password request
            await client.forgotPassword.create({
                data: {
                    userId,
                    emailId,
                    nonce,
                },
            });
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getForgotPassword(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            // Return the forgot password request
            return await client.forgotPassword.findFirst({
                where: {
                    userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async updatePassword(userId, password) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            // Update the password
            await client.user.update({
                where: {
                    id: userId,
                },
                data: {
                    password,
                },
            });
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
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
                    Book: {
                        include: {
                            BookReview: true,
                            BookAuthor: true,
                            BookLikeDislike: {
                                where: {
                                    isLiked: true,
                                },
                            },
                        },
                    },
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
    async getCartById(cartId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const cartdata = await client.cart.findFirst({
                where: {
                    id: cartId,
                },
            });
            return cartdata;
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
    async getCartByUserIdAndBookId(userId, bookId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const cartdata = await client.cart.findFirst({
                where: {
                    userId,
                    bookId,
                },
            });
            return cartdata;
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
    async deleteCartItem(cartId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const deleteCart = await client.cart.delete({
                where: {
                    id: cartId,
                },
            });
            return deleteCart !== null;
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
                    firstName: newOrder.firstName,
                    lastName: newOrder.lastName,
                    emailId: newOrder.emailId,
                    mobileNumber: newOrder.mobileNumber,
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
    async createUserCurrentBook(orderId, userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userCurrentBook = await client.userCurrentBook.create({
                data: {
                    orderId,
                    userId,
                },
            });
            return userCurrentBook !== null;
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
    async verifyUser(userId, isVerify) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userData = await client.user.update({
                where: {
                    id: userId,
                },
                data: {
                    isVerify,
                },
            });
            return userData !== null;
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
    async doneSubscriptionProcess(userId, isDone) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userData = await client.user.update({
                where: {
                    id: userId,
                },
                data: {
                    isSubscriptionComplete: isDone,
                },
            });
            return userData !== null;
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
    async getUser(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userData = await client.user.findFirst({
                where: {
                    id: userId,
                },
                include: {
                    UserBook: {
                        select: {
                            Book: {
                                include: {
                                    BookAuthor: true,
                                },
                            },
                        },
                    },
                    UserSubscription: {
                        include: {
                            UserSubscriptionUsage: true,
                        },
                    },
                },
            });
            return userData;
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
    async createUserBook(userId, bookId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const adduserBook = await client.userBook.create({
                data: {
                    userId,
                    bookId,
                },
            });
            return adduserBook;
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
    async getUserLatestOrder(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userOrder = await client.order.findFirst({
                where: {
                    userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return userOrder;
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
    async getUserLastSuccessOrder(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const order = await client.order.findFirst({
                where: {
                    userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1,
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
    async createBookExchangeLog(userId, previousOrderId, latestOrderId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const bookExchangeLog = await client.userBookExchangeLogs.create({
                data: {
                    userId,
                    previousOrderId,
                    latestOrderId,
                },
            });
            return bookExchangeLog;
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
    async getUserWithCount(userId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const user = await client.user.findFirst({
                where: {
                    id: userId,
                },
                include: {
                    UserBookExchangeLogs: true,
                    EventRegistration: true,
                    Discussion: true,
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
    async updateUser(updateUser) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const updateuser = await client.user.update({
                where: {
                    id: updateUser.id,
                },
                data: {
                    firstName: updateUser.firstName,
                    mobileNumber: updateUser.mobileNumber,
                    address: updateUser.address,
                    profilePicture: updateUser.profilePicture,
                },
            });
            return updateuser;
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
    async newusers(isVerify) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const users = await client.user.findMany({
                where: {
                    isVerify,
                    UserRole: {
                        every: {
                            Role: {
                                name: isVerify ? 'Member' : 'User',
                            },
                        },
                    },
                },
                include: {
                    UserBook: {
                        select: {
                            Book: true,
                        },
                    },
                    UserSubscription: true,
                },
            });
            return users;
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
    async changeSubscriptionStatus(userId, status) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const user = await client.user.update({
                where: {
                    id: userId,
                },
                data: {
                    isSubscriptionComplete: status,
                },
            });
            return user !== null;
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
    async deleteUserSubscription(id) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const userSubscriptionUsage = await client.userSubscriptionUsage.deleteMany({
                where: {
                    userSubscriptionId: id,
                },
            });
            const userSubscription = await client.userSubscription.deleteMany({
                where: {
                    id,
                },
            });
            return userSubscription !== null;
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
    async getOrder(status) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const order = await client.order.findMany({
                where: {
                    status,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    User: true,
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
    async getOrderById(id) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const order = await client.order.findFirst({
                where: {
                    id,
                    OR: [
                        {
                            status: 'PENDING',
                        },
                        {
                            status: 'ONTHEWAY',
                        },
                        {
                            status: 'CANCLE',
                        },
                        {
                            status: 'DELIVERED',
                        },
                    ],
                },
                include: {
                    OrderDetail: {
                        include: {
                            Book: {
                                include: {
                                    BookAuthor: true,
                                },
                            },
                        },
                    },
                    User: {
                        include: {
                            UserBookExchangeLogs: {
                                orderBy: {
                                    createdAt: 'desc',
                                },
                                take: 1,
                                include: {
                                    PreviousOrder: {
                                        include: {
                                            OrderDetail: {
                                                include: {
                                                    Book: {
                                                        include: {
                                                            BookAuthor: true,
                                                        },
                                                    },
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
    async orderStatusChange(id, status) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const order = await client.order.update({
                where: {
                    id,
                },
                data: {
                    status,
                },
            });
            return order !== null;
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
