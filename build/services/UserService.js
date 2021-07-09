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
const NotFound_1 = require("../errors/NotFound");
const BadRequest_1 = require("../errors/BadRequest");
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
        const cart = await this._userRepository.addToCart(userId, bookId, quantity);
        return cart;
    }
    async generateOrder(userId, deliveryAddress, totalAmount) {
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
        const newOrderPayload = {
            userId,
            deliveryAddress,
            totalAmount,
        };
        const order = await this._userRepository.createOrder(newOrderPayload);
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
