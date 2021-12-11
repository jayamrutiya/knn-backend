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
const runtime_1 = require("@prisma/client/runtime");
const env_1 = __importDefault(require("../config/env"));
const client_1 = require(".prisma/client");
const BadRequest_1 = require("../errors/BadRequest");
let UserController = class UserController extends BaseController_1.default {
    constructor(loggerService, userService) {
        super();
        this._loggerService = loggerService;
        this._userService = userService;
        this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
    }
    async doesUserNameExist(req, res) {
        try {
            // validate input
            this.validateRequest(req);
            // Get parameter
            const userName = typeof req.query.userName === 'string' ? req.query.userName : '';
            // Check if email already present
            const inUse = await this._userService.getUserByUserName(userName);
            // Return the response
            return this.sendJSONResponse(res, null, {
                size: 1,
            }, {
                code: inUse ? 'IN_USE' : 'AVAILABLE',
                message: inUse
                    ? 'User name already in use.'
                    : 'User name is available.',
            });
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async createUser(req, res) {
        try {
            // validate input
            this.validateRequest(req);
            // get parameters
            const { firstName, lastName, userName, emailId, mobileNumber, password, address, city, street, } = req.body;
            const newUser = {
                firstName,
                lastName,
                profilePicture: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
                    : null,
                userName,
                emailId,
                mobileNumber,
                password,
                salt: '',
                address,
                city,
                street,
            };
            const user = await this._userService.createUser(newUser);
            // Return response
            return this.sendJSONResponse(res, 'User created successfully', {
                length: 1,
            }, user);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async addToCart(req, res) {
        try {
            console.log('in addToCart');
            // TODO: validate parameters
            const userId = BigInt(req.body.userId);
            const bookId = BigInt(req.body.bookId);
            const quantity = parseInt(req.body.quantity);
            const cart = await this._userService.addToCart(userId, bookId, quantity);
            // Return response
            return this.sendJSONResponse(res, 'Added Successfully', {
                length: 1,
            }, cart);
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getCartByUserId(req, res) {
        try {
            console.log('getCartByUserId');
            // TODO: validate parameters
            const userId = BigInt(req.params.userId);
            const cart = await this._userService.getCartByUserId(userId);
            // Return response
            return this.sendJSONResponse(res, null, {
                length: cart.length,
            }, cart);
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
    async deleteCartItem(req, res) {
        try {
            console.log('in deleteCartItem');
            // TODO: validate parameters
            const cartItemId = BigInt(req.params.id);
            const cart = await this._userService.deleteCartItem(cartItemId);
            // Return response
            return this.sendJSONResponse(res, cart ? 'Delete Successfully' : 'Something went wrong', null, null);
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
    async generateOrder(req, res) {
        try {
            // TODO: validate parameters
            console.log('body', req.body);
            const userId = BigInt(req.body.userId);
            const { firstName, lastName, emailId, mobileNumber, deliveryAddress, } = req.body;
            // const deliveryAddress = req.body.deliveryAddress.toString();
            const totalAmount = new runtime_1.Decimal(req.body.totalAmount);
            const order = await this._userService.generateOrder(userId, firstName, lastName, emailId, mobileNumber, deliveryAddress, totalAmount);
            // Return response
            return this.sendJSONResponse(res, 'Ordered Successfully', {
                length: 1,
            }, order);
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
    async verifyUser(req, res) {
        try {
            const { userId, isVerify } = req.body;
            const userVerify = await this._userService.verifyUser(BigInt(userId), isVerify);
            // Return response
            return this.sendJSONResponse(res, isVerify ? 'User verifed successfully' : 'User not verifed', null, null);
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getUser(req, res) {
        try {
            const userId = req.params.userId;
            const user = await this._userService.getUser(BigInt(userId));
            // Return response
            return this.sendJSONResponse(res, null, null, user);
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getUserWithCount(req, res) {
        try {
            const userId = req.params.userId;
            const user = await this._userService.getUserWithCount(BigInt(userId));
            // Return response
            return this.sendJSONResponse(res, null, null, user);
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
    async updateUser(req, res) {
        try {
            console.log(req.file);
            // get parameters
            const { firstName, mobileNumber, address } = req.body;
            const updateUser = {
                id: BigInt(req.params.id),
                firstName,
                profilePicture: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/Profile/${req.file.filename}`
                    : null,
                mobileNumber,
                address,
            };
            const user = await this._userService.updateUser(updateUser);
            // Return response
            return this.sendJSONResponse(res, null, null, user);
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
    async newUser(req, res) {
        try {
            const isVerify = req.query.isVerify === 'true';
            // Return response
            return this.sendJSONResponse(res, null, null, await this._userService.newusers(isVerify));
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getOrder(req, res) {
        try {
            let status;
            if (req.query.status === 'PENDING') {
                status = client_1.OrderStatus['PENDING'];
            }
            else if (req.query.status === 'DELIVERED') {
                status = client_1.OrderStatus['DELIVERED'];
            }
            else if (req.query.status === 'ONTHEWAY') {
                status = client_1.OrderStatus['ONTHEWAY'];
            }
            else if (req.query.status === 'CANCLE') {
                status = client_1.OrderStatus['CANCLE'];
            }
            else {
                throw new BadRequest_1.BadRequest('This is not valid status');
            }
            // Return response
            return this.sendJSONResponse(res, null, null, await this._userService.getOrder(status));
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
    async orderStatusChange(req, res) {
        try {
            let status;
            if (req.query.status === 'PENDING') {
                status = client_1.OrderStatus['PENDING'];
            }
            else if (req.query.status === 'DELIVERED') {
                status = client_1.OrderStatus['DELIVERED'];
            }
            else if (req.query.status === 'ONTHEWAY') {
                status = client_1.OrderStatus['ONTHEWAY'];
            }
            else if (req.query.status === 'CANCLE') {
                status = client_1.OrderStatus['CANCLE'];
            }
            else {
                throw new BadRequest_1.BadRequest('This is not valid status');
            }
            const id = BigInt(req.params.orderId);
            const order = await this._userService.orderStatusChange(id, status);
            // Return response
            return this.sendJSONResponse(res, 'Order Status chanaged.', null, null);
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getOrderById(req, res) {
        try {
            const id = BigInt(req.params.id);
            const order = await this._userService.getOrderById(id);
            // Return response
            return this.sendJSONResponse(res, null, null, order);
        }
        catch (error) {
            console.log(error);
            return this.sendErrorResponse(req, res, error);
        }
    }
};
UserController = __decorate([
    inversify_1.injectable()
], UserController);
exports.default = UserController;
