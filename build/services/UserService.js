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
exports.UserService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const crypto_1 = __importDefault(require("crypto"));
const client_1 = require("@prisma/client");
const NotFound_1 = require("../errors/NotFound");
const BadRequest_1 = require("../errors/BadRequest");
const runtime_1 = require("@prisma/client/runtime");
const events_1 = require("../config/events");
const express_1 = __importDefault(require("../config/express"));
let UserService = class UserService {
    constructor(loggerService, userRepository, roleRepository, bookRepository) {
        this._loggerService = loggerService;
        this._userRepository = userRepository;
        this._roleRepository = roleRepository;
        this._bookRepository = bookRepository;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async createUser(newUser) {
        // Create hash of the password
        newUser.salt = crypto_1.default.randomBytes(16).toString('hex');
        newUser.password = crypto_1.default
            .pbkdf2Sync(newUser.password, newUser.salt, 1000, 64, 'sha512')
            .toString('hex');
        const user = await this._userRepository.createUser(newUser);
        const role = await this._roleRepository.getRoleByName('User');
        await this._roleRepository.assignRoleToUser(role.id, user.id);
        return user;
    }
    async getUserByUserName(userName) {
        return this._userRepository.getUserByUserName(userName);
    }
    async addToCart(userId, bookId, quantity) {
        const user = await this._userRepository.getUserById(userId);
        if (user === null) {
            throw new NotFound_1.NotFound(`User not found with userId ${userId}`);
        }
        const book = await this._bookRepository.getBookById(bookId);
        const cartdata = await this._userRepository.getCartByUserIdAndBookId(userId, bookId);
        if (cartdata) {
            throw new BadRequest_1.BadRequest('Book alredy in cart.');
        }
        const cart = await this._userRepository.addToCart(userId, bookId, quantity);
        return cart;
    }
    async generateOrder(userId, firstName, lastName, emailId, mobileNumber, deliveryAddress, totalAmount) {
        const user = await this._userRepository.getUserById(userId);
        if (user === null) {
            throw new NotFound_1.NotFound(`User not found with userId ${userId}`);
        }
        const userRole = await this._roleRepository.getUserRole(userId);
        if (userRole.Role !== 'Member') {
            throw new BadRequest_1.BadRequest('User not purchase any subscription plan');
        }
        const cart = await this._userRepository.getCartByUserId(userId);
        if (cart.length === 0) {
            throw new BadRequest_1.BadRequest('Your cart is empty.');
        }
        if (cart.length !== 2) {
            throw new BadRequest_1.BadRequest('Must buy 2 item per order.');
        }
        let totalPrice = 0.0;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].Book.stock <= 0) {
                throw new BadRequest_1.BadRequest(`${cart[i].Book.bookName} is out of stock.`);
            }
            totalPrice = Number(totalPrice) + Number(cart[i].Book.price);
        }
        const newOrderPayload = {
            userId,
            firstName,
            lastName,
            emailId,
            mobileNumber,
            deliveryAddress,
            totalAmount: new runtime_1.Decimal(totalPrice),
        };
        let lastOrderId;
        const lastOrder = await this._userRepository.getUserLastSuccessOrder(userId);
        if (lastOrder !== null &&
            (lastOrder.status === client_1.OrderStatus['PENDING'] ||
                lastOrder.status === client_1.OrderStatus['ONTHEWAY'])) {
            throw new BadRequest_1.BadRequest(`Your last order status is ${lastOrder.status}. So you can't place new order.`);
        }
        const order = await this._userRepository.createOrder(newOrderPayload);
        if (lastOrder !== null && lastOrder.status === client_1.OrderStatus['DELIVERED']) {
            lastOrderId = lastOrder.id;
        }
        else {
            lastOrderId = order.id;
        }
        await this._userRepository.createBookExchangeLog(userId, lastOrderId, order.id);
        // await this._userRepository.createUserCurrentBook(order.id, userId);
        const newOrderDetailPayload = cart.map((cartItem) => {
            return {
                orderId: order.id,
                bookId: cartItem.bookId,
                quantity: cartItem.quantity,
                price: cartItem.Book.price,
            };
        });
        const orderDetail = await this._userRepository.createOrderDetail(newOrderDetailPayload);
        await this._userRepository.deleteCartByUserId(userId);
        cart.map(async (item) => await this._bookRepository.updateBookStock(item.bookId, false));
        // send email
        express_1.default.emit(events_1.EventTypes.SEND_COMMON_EMAIL, {
            subject: 'Knn - Buy Subscription',
            body: `<p>You order created successfully. Order Id: ${order.id}</p>`,
            emailId: emailId,
        });
        return order;
    }
    async verifyUser(userId, isVerify) {
        const user = await this._userRepository.getUser(userId);
        if (user.isSubscriptionComplete === false) {
            throw new BadRequest_1.BadRequest('User Not complete subscription process');
        }
        if (isVerify) {
            const userRole = await this._roleRepository.getUserRole(userId);
            const getRoleId = await this._roleRepository.getRoleByName('Member');
            const userBook = await this._bookRepository.getBookByCreateBy(userId);
            console.log('userBook', userBook);
            if (userBook) {
                for (let i = 0; i < userBook.length; i++) {
                    if (userBook[i].Book.isActivated === false) {
                        throw new BadRequest_1.BadRequest('User Book not verify yet. First do verify book that upload by user.');
                    }
                }
            }
            await this._roleRepository.updateUserRoler(getRoleId.id, userRole.id);
            // send email
            express_1.default.emit(events_1.EventTypes.SEND_COMMON_EMAIL, {
                subject: 'Knn - Verification',
                body: `<p>You Subscription is verify successfully.</p>`,
                emailId: user.emailId,
            });
        }
        else {
            await this._userRepository.changeSubscriptionStatus(userId, false);
            if (user.UserSubscription[0].type === 'BOOK') {
                const userBook = await this._bookRepository.getBookByCreateBy(userId);
                if (userBook) {
                    for (let i = 0; i < userBook.length; i++) {
                        await this._bookRepository.deleteBook(userBook[i].Book.id);
                    }
                }
            }
            await this._userRepository.deleteUserSubscription(user.UserSubscription[0].id);
            // send email
            express_1.default.emit(events_1.EventTypes.SEND_COMMON_EMAIL, {
                subject: 'Knn - Verification',
                body: `<p>You Subscription is not verify. Please contatct admin.</p>`,
                emailId: user.emailId,
            });
        }
        return this._userRepository.verifyUser(userId, isVerify);
    }
    async getUser(userId) {
        return this._userRepository.getUser(userId);
    }
    async getCartByUserId(userId) {
        const cart = await this._userRepository.getCartByUserId(userId);
        return cart;
    }
    async getCartById(cartId) {
        return this._userRepository.getCartById(cartId);
    }
    async deleteCartItem(cartId) {
        const cart = await this._userRepository.getCartById(cartId);
        if (cart === null) {
            throw new NotFound_1.NotFound('Cat item not found');
        }
        return this._userRepository.deleteCartItem(cartId);
    }
    async getUserWithCount(userId) {
        const user = await this._userRepository.getUserWithCount(userId);
        if (user === null) {
            throw new NotFound_1.NotFound('User not found');
        }
        const data = {
            id: user.id,
            profilePicture: user.profilePicture,
            firstName: user.firstName,
            emailId: user.emailId,
            mobileNumber: user.mobileNumber,
            address: user.address,
            bookExchanged: user.UserBookExchangeLogs.length,
            eventParticipated: user.EventRegistration.length,
            discussions: user.Discussion.length,
        };
        return data;
    }
    async updateUser(updateUser) {
        const user = await this._userRepository.getUserWithCount(updateUser.id);
        if (user === null) {
            throw new NotFound_1.NotFound('User not found');
        }
        if (updateUser.profilePicture === null) {
            updateUser.profilePicture = user.profilePicture;
        }
        return this._userRepository.updateUser(updateUser);
    }
    async newusers(isVerify) {
        return this._userRepository.newusers(isVerify);
    }
    async getOrder(status) {
        return this._userRepository.getOrder(status);
    }
    async orderStatusChange(id, status) {
        console.log('status', status);
        let order = await this._userRepository.getOrderById(id);
        if (order === null) {
            throw new BadRequest_1.BadRequest('Order not found');
        }
        if (order.User.UserBookExchangeLogs[0].previousOrderId ===
            order.User.UserBookExchangeLogs[0].latestOrderId) {
            const getUserBook = await this._bookRepository.getBookByCreateBy(order.userId);
            order.GetBackFromUser = await getUserBook.map((data) => data.Book);
            delete order.User.UserBookExchangeLogs;
        }
        else {
            order.GetBackFromUser = await order.User.UserBookExchangeLogs[0]
                .PreviousOrder.OrderDetail;
            delete order.User.UserBookExchangeLogs;
        }
        if (status === client_1.OrderStatus['DELIVERED']) {
            // send email
            express_1.default.emit(events_1.EventTypes.SEND_COMMON_EMAIL, {
                subject: 'Knn - Order',
                body: `<p>You order is deliverd. Order Id: ${order.id}</p>`,
                emailId: order.emailId,
            });
            for (let i = 0; i < order.GetBackFromUser.length; i++) {
                await this._bookRepository.updateBookStock(order.GetBackFromUser[i].id, true);
            }
        }
        if (status === client_1.OrderStatus['CANCLE']) {
            // send email
            express_1.default.emit(events_1.EventTypes.SEND_COMMON_EMAIL, {
                subject: 'Knn - Order',
                body: `<p>You order is cancle. Please contact to Admin. Order Id: ${order.id}</p>`,
                emailId: order.emailId,
            });
            for (let i = 0; i < order.OrderDetail.length; i++) {
                await this._bookRepository.updateBookStock(order.OrderDetail[i].Book.id, true);
            }
        }
        if (status === client_1.OrderStatus['ONTHEWAY']) {
            // send email
            express_1.default.emit(events_1.EventTypes.SEND_COMMON_EMAIL, {
                subject: 'Knn - Order',
                body: `<p>You order is dispatch. Order Id: ${order.id}</p>`,
                emailId: order.emailId,
            });
        }
        return this._userRepository.orderStatusChange(id, status);
    }
    async getOrderById(id) {
        let order = await this._userRepository.getOrderById(id);
        console.log('order', order);
        if (order.User.UserBookExchangeLogs[0].previousOrderId ===
            order.User.UserBookExchangeLogs[0].latestOrderId) {
            const getUserBook = await this._bookRepository.getBookByCreateBy(order.userId);
            order.GetBackFromUser = await getUserBook.map((data) => data.Book);
            delete order.User.UserBookExchangeLogs;
        }
        else {
            order.GetBackFromUser = await order.User.UserBookExchangeLogs[0]
                .PreviousOrder.OrderDetail;
            delete order.User.UserBookExchangeLogs;
        }
        return order;
    }
};
UserService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.UserRepository)),
    __param(2, inversify_1.inject(types_1.TYPES.RoleRepository)),
    __param(3, inversify_1.inject(types_1.TYPES.BookRepository))
], UserService);
exports.UserService = UserService;
