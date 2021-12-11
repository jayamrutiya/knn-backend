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
const client_1 = require("@prisma/client");
let CategoryController = class CategoryController extends BaseController_1.default {
    constructor(loggerService, categoryService) {
        super();
        this._loggerService = loggerService;
        this._categoryService = categoryService;
        this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
    }
    async getCategories(req, res) {
        try {
            const categoryType = req.query.categoryType?.toString() === 'all'
                ? 'all'
                : req.query.categoryType?.toString() === 'BOOK'
                    ? client_1.CategoryType['BOOK']
                    : client_1.CategoryType['DISCUSSION'];
            const category = await this._categoryService.getCategories(categoryType);
            // Return response
            return this.sendJSONResponse(res, null, {
                length: category.length,
            }, category);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async createCategory(req, res) {
        try {
            const { name, type, createdBy } = req.body;
            const category = await this._categoryService.createCategory(name, type === 'BOOK' ? client_1.CategoryType['BOOK'] : client_1.CategoryType['DISCUSSION'], BigInt(createdBy));
            // Return response
            return this.sendJSONResponse(res, 'Category created successfully', null, category);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async deleteCategory(req, res) {
        try {
            const id = BigInt(req.params.id);
            const category = await this._categoryService.deleteCategory(id);
            // Return response
            return this.sendJSONResponse(res, category ? 'Category delete successfully' : 'Something went wrong', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
};
CategoryController = __decorate([
    inversify_1.injectable()
], CategoryController);
exports.default = CategoryController;
