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
exports.CategoryRepository = void 0;
const types_1 = require("../config/types");
const inversify_1 = require("inversify");
const InternalServerError_1 = require("../errors/InternalServerError");
const runtime_1 = require("@prisma/client/runtime");
const BadRequest_1 = require("../errors/BadRequest");
let CategoryRepository = class CategoryRepository {
    constructor(loggerService, databaseService) {
        this._loggerService = loggerService;
        this._databaseService = databaseService;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async getCategories(categoryType) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const category = await client.category.findMany({
                where: categoryType === 'all'
                    ? {
                        OR: [
                            {
                                type: 'BOOK',
                            },
                            {
                                type: 'DISCUSSION',
                            },
                        ],
                    }
                    : {
                        type: categoryType,
                    },
            });
            return category;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async createCategory(name, type, createdBy) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const category = await client.category.create({
                data: {
                    categoryName: name,
                    type,
                    isActivated: true,
                    createdBy,
                },
            });
            return category;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async deleteCategory(id) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const category = await client.category.delete({
                where: {
                    id,
                },
            });
            return category !== null;
        }
        catch (error) {
            console.log('Error: ', error);
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof runtime_1.PrismaClientKnownRequestError) {
                throw new BadRequest_1.BadRequest('This category assign to somewhere');
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
};
CategoryRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.DatabaseService))
], CategoryRepository);
exports.CategoryRepository = CategoryRepository;
