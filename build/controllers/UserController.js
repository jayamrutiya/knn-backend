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
    async generateOrder(req, res) {
        try {
            // TODO: validate parameters
            const userId = BigInt(req.body.userId);
            const deliveryAddress = req.body.deliveryAddress.toString();
            const totalAmount = new runtime_1.Decimal(req.body.totalAmount);
            const order = await this._userService.generateOrder(userId, deliveryAddress, totalAmount);
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
};
UserController = __decorate([
    inversify_1.injectable()
], UserController);
exports.default = UserController;
