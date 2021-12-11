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
exports.DiscussionService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const NotFound_1 = require("../errors/NotFound");
let DiscussionService = class DiscussionService {
    constructor(loggerService, discussionRepository, roleRepository, userRepository, subscriptionRepository) {
        this._loggerService = loggerService;
        this._discussionRepository = discussionRepository;
        this._roleRepository = roleRepository;
        this._userRepository = userRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async creatDiscussion(newDiscussion) {
        const user = await this._userRepository.getUserById(newDiscussion.createdBy);
        if (user === null) {
            throw new NotFound_1.NotFound(`User not found with userId ${newDiscussion.createdBy}`);
        }
        return this._discussionRepository.creatDiscussion(newDiscussion);
    }
    async updateDiscussion(updateDiscussion) {
        return this._discussionRepository.updateDiscussion(updateDiscussion);
    }
    async getDiscussion(discussionId) {
        return this._discussionRepository.getDiscussion(discussionId);
    }
    async getAllDiscussion(categoryId) {
        return this._discussionRepository.getAllDiscussion(categoryId);
    }
    async createAnswer(discussionId, answeredBy, answer) {
        const user = await this._userRepository.getUserById(answeredBy);
        if (user === null) {
            throw new NotFound_1.NotFound(`User not found with id ${answeredBy}`);
        }
        await this._discussionRepository.getDiscussion(discussionId);
        return this._discussionRepository.createAnswer(discussionId, answeredBy, answer);
    }
};
DiscussionService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.DiscussionRepository)),
    __param(2, inversify_1.inject(types_1.TYPES.RoleRepository)),
    __param(3, inversify_1.inject(types_1.TYPES.UserRepository)),
    __param(4, inversify_1.inject(types_1.TYPES.SubscriptionRepository))
], DiscussionService);
exports.DiscussionService = DiscussionService;
