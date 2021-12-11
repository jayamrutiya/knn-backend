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
let DiscussionController = class DiscussionController extends BaseController_1.default {
    constructor(loggerService, discussionService) {
        super();
        this._loggerService = loggerService;
        this._discussionService = discussionService;
        this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
    }
    async createDiscussion(req, res) {
        try {
            console.log(req.body);
            const { question, description, createdBy, categoryId } = req.body;
            const newDiscussion = {
                titleImage: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
                    : 'no image',
                question,
                description,
                createdBy: BigInt(createdBy),
                categoryId: BigInt(categoryId),
            };
            const discussion = await this._discussionService.creatDiscussion(newDiscussion);
            // Return response
            return this.sendJSONResponse(res, 'Discussion created successfully', {
                length: 1,
            }, discussion);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async updateDiscussion(req, res) {
        try {
            const { question, description, createdBy, categoryId } = req.body;
            const updateDiscussion = {
                id: BigInt(req.params.id),
                titleImage: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
                    : 'no image',
                question,
                description,
                createdBy: BigInt(createdBy),
                categoryId: BigInt(categoryId),
            };
            const discussion = await this._discussionService.updateDiscussion(updateDiscussion);
            // Return response
            return this.sendJSONResponse(res, 'Discussion updated successfully', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getDiscussion(req, res) {
        try {
            const discussionId = BigInt(req.params.id);
            const discussion = await this._discussionService.getDiscussion(discussionId);
            // Return response
            return this.sendJSONResponse(res, null, {
                length: 1,
            }, discussion);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getAllDiscussion(req, res) {
        try {
            const categoryId = req.query.categoryId === undefined ||
                req.query.categoryId === 'null' ||
                req.query.categoryId === null
                ? null
                : BigInt(req.query.categoryId.toString());
            const discussion = await this._discussionService.getAllDiscussion(categoryId);
            // Return response
            return this.sendJSONResponse(res, null, {
                length: discussion.length,
            }, discussion);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async createAnswer(req, res) {
        try {
            const { discussionId, answeredBy, answer } = req.body;
            const discussionAnswer = await this._discussionService.createAnswer(BigInt(discussionId), BigInt(answeredBy), answer);
            // Return response
            return this.sendJSONResponse(res, null, {
                length: 1,
            }, discussionAnswer);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
};
DiscussionController = __decorate([
    inversify_1.injectable()
], DiscussionController);
exports.default = DiscussionController;
