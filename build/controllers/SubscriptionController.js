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
const inversify_1 = require("inversify");
const BaseController_1 = __importDefault(require("./BaseController"));
const env_1 = __importDefault(require("../config/env"));
let SubscriptionController = class SubscriptionController extends BaseController_1.default {
    constructor(loggerService, subscriptionService) {
        super();
        this._loggerService = loggerService;
        this._subscriptionService = subscriptionService;
        this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
    }
    async getSubscription(req, res) {
        try {
            //ToDo: add validation
            // get parameter
            const subscriptionId = BigInt(req.params.id);
            const subscription = await this._subscriptionService.getSubscription(subscriptionId);
            //return response
            return this.sendJSONResponse(res, null, {
                length: 1,
            }, subscription);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getAllSubscription(req, res) {
        try {
            //ToDo: add validation
            const subscription = await this._subscriptionService.getAllSubscription();
            //return response
            return this.sendJSONResponse(res, null, {
                length: subscription.length,
            }, subscription);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async userBuySubscription(req, res) {
        try {
            console.log('in userBuySubscription controller', req.body.bookName);
            // validate input
            // this.validateRequest(req);
            console.log('files', req.files);
            const files = req.files;
            const fileData = [];
            if (req.files) {
                for (let i = 0; i < files.length; i++) {
                    fileData.push(`${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${files[i].filename}`);
                }
            }
            const { bookName, authorName, userId, subscriptionId } = req.body;
            const userSubscription = {
                bookName: bookName.map((book) => book.toString().toLowerCase()),
                authorName: authorName.map((authore) => authore.toString().toLowerCase()),
                titleImage: fileData,
                userId: BigInt(userId),
                subscriptionId: BigInt(subscriptionId),
            };
            console.log('userSubscription', userSubscription);
            const usersubscription = await this._subscriptionService.userBuySubscription(userSubscription);
            //return response
            return this.sendJSONResponse(res, usersubscription
                ? 'User buy subscription successfully'
                : 'Somthing went wrong', null, usersubscription);
        }
        catch (error) {
            console.log(error, 'err');
            return this.sendErrorResponse(req, res, error);
        }
    }
};
SubscriptionController = __decorate([
    inversify_1.injectable()
], SubscriptionController);
exports.default = SubscriptionController;
