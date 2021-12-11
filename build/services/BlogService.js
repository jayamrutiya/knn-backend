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
exports.BlogService = void 0;
const inversify_1 = require("inversify");
const env_1 = __importDefault(require("../config/env"));
const types_1 = require("../config/types");
const fs_1 = __importDefault(require("fs"));
const BadRequest_1 = require("../errors/BadRequest");
let BlogService = class BlogService {
    constructor(loggerService, blogRepository, roleRepository, userRepository, subscriptionRepository) {
        this._loggerService = loggerService;
        this._blogRepository = blogRepository;
        this._roleRepository = roleRepository;
        this._userRepository = userRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async createBlog(newBlog) {
        return this._blogRepository.createBlog(newBlog);
    }
    async getBlog(blogId) {
        return this._blogRepository.getBlog(blogId);
    }
    async getAllBlog() {
        return this._blogRepository.getAllBlog();
    }
    async updateBlog(updateBlog) {
        const blog = await this._blogRepository.getBlog(updateBlog.id);
        if (updateBlog.titleImage === 'no image') {
            updateBlog.titleImage = blog.titleImage;
        }
        else {
            await fs_1.default.unlinkSync(`${env_1.default.DIRECTORY}${blog.titleImage.split(/images/)[1]}`);
        }
        return this._blogRepository.updateBlog(updateBlog);
    }
    async getBlogWriter() {
        return this._blogRepository.getBlogWriter();
    }
    async createBlogWrite(newCreateBlogWriter) {
        return this._blogRepository.createBlogWrite(newCreateBlogWriter);
    }
    async deleteBlog(blogId) {
        const blog = await this._blogRepository.getBlog(blogId);
        await fs_1.default.unlinkSync(`${env_1.default.DIRECTORY}${blog.titleImage.split(/images/)[1]}`);
        return this._blogRepository.deleteBlog(blogId);
    }
    async deleteBlogWriter(id) {
        const blogs = await this._blogRepository.getBlogByBlogWriter(id);
        if (blogs.length > 0) {
            throw new BadRequest_1.BadRequest('Some Blogs written by this writer');
        }
        return this._blogRepository.deleteBlogWriter(id);
    }
};
BlogService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.BlogRepository)),
    __param(2, inversify_1.inject(types_1.TYPES.RoleRepository)),
    __param(3, inversify_1.inject(types_1.TYPES.UserRepository)),
    __param(4, inversify_1.inject(types_1.TYPES.SubscriptionRepository))
], BlogService);
exports.BlogService = BlogService;
