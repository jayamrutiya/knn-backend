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
exports.DiscussionRepository = void 0;
const inversify_1 = require("inversify");
const moment_1 = __importDefault(require("moment"));
const types_1 = require("../config/types");
const InternalServerError_1 = require("../errors/InternalServerError");
const NotFound_1 = require("../errors/NotFound");
let DiscussionRepository = class DiscussionRepository {
    constructor(loggerService, databaseService) {
        this._loggerService = loggerService;
        this._databaseService = databaseService;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async creatDiscussion(newDiscussion) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const discussion = await client.discussion.create({
                data: {
                    titleImage: newDiscussion.titleImage,
                    question: newDiscussion.question,
                    description: newDiscussion.description,
                    createdBy: newDiscussion.createdBy,
                    categoryId: newDiscussion.categoryId,
                },
            });
            return discussion;
        }
        catch (error) {
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
    async updateDiscussion(updateDiscussion) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const discussion = await client.discussion.update({
                where: {
                    id: updateDiscussion.id,
                },
                data: {
                    titleImage: updateDiscussion.titleImage,
                    question: updateDiscussion.question,
                    description: updateDiscussion.description,
                    createdBy: updateDiscussion.createdBy,
                    categoryId: updateDiscussion.categoryId,
                    updatedAt: moment_1.default().format(),
                },
            });
            return discussion !== null;
        }
        catch (error) {
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
    async getDiscussion(discussionId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const discussion = await client.discussion.findFirst({
                where: {
                    id: discussionId,
                },
                include: {
                    User: true,
                    DiscussionAnswer: {
                        include: {
                            User: true,
                        },
                    },
                },
            });
            if (discussion === null) {
                throw new NotFound_1.NotFound('Discussion not found');
            }
            return discussion;
        }
        catch (error) {
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
    async getAllDiscussion(categoryId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const discussion = await client.discussion.findMany({
                where: categoryId === null
                    ? {}
                    : {
                        categoryId,
                    },
                include: {
                    Category: true,
                    User: true,
                    DiscussionAnswer: {
                        include: {
                            User: true,
                        },
                    },
                },
            });
            return discussion;
        }
        catch (error) {
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
    async createAnswer(discussionId, answeredBy, answer) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const discissionAnswer = await client.discussionAnswer.create({
                data: {
                    discussionId,
                    answeredBy,
                    answer,
                },
            });
            return discissionAnswer;
        }
        catch (error) {
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
};
DiscussionRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.DatabaseService))
], DiscussionRepository);
exports.DiscussionRepository = DiscussionRepository;
