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
            console.log('in userBuySubscription controller');
            // validate input
            this.validateRequest(req);
            const userId = BigInt(req.params.userId);
            const subscriptionId = BigInt(req.params.subscriptionId);
            const userSubscription = await this._subscriptionService.userBuySubscription(userId, subscriptionId);
            //return response
            return this.sendJSONResponse(res, userSubscription
                ? 'User buy subscription successfully'
                : 'Somthing went wrong', null, null);
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
