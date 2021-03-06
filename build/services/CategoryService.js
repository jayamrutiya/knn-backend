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
exports.CategoryService = void 0;
const types_1 = require("../config/types");
const inversify_1 = require("inversify");
let CategoryService = class CategoryService {
    constructor(loggerService, categoryRepository) {
        this._loggerService = loggerService;
        this._categoryRepository = categoryRepository;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async getCategories(categoryType) {
        return this._categoryRepository.getCategories(categoryType);
    }
    async createCategory(name, type, createdBy) {
        return this._categoryRepository.createCategory(name, type, createdBy);
    }
    async deleteCategory(id) {
        return this._categoryRepository.deleteCategory(id);
    }
};
CategoryService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.CategoryRepository))
], CategoryService);
exports.CategoryService = CategoryService;
