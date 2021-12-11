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
let BlogController = class BlogController extends BaseController_1.default {
    constructor(loggerService, blogService) {
        super();
        this._loggerService = loggerService;
        this._blogService = blogService;
        this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
    }
    async createBlog(req, res) {
        try {
            const { title, subTitle, body, blogWriter } = req.body;
            const newBlog = {
                title,
                subTitle,
                body,
                titleImage: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
                    : 'no image',
                blogWriter: BigInt(blogWriter),
            };
            const blog = await this._blogService.createBlog(newBlog);
            // Return response
            return this.sendJSONResponse(res, 'Blog created successfully', {
                length: 1,
            }, blog);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getBlog(req, res) {
        try {
            const blogId = BigInt(req.params.id);
            const blog = await this._blogService.getBlog(blogId);
            // Return response
            return this.sendJSONResponse(res, null, {
                length: 1,
            }, blog);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getAllBlog(req, res) {
        try {
            const blog = await this._blogService.getAllBlog();
            // Return response
            return this.sendJSONResponse(res, null, {
                length: blog.length,
            }, blog);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async updateBlog(req, res) {
        try {
            const { title, subTitle, body, blogWriter } = req.body;
            const updateBlog = {
                id: BigInt(req.params.id),
                title,
                subTitle,
                body,
                titleImage: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
                    : 'no image',
                blogWriter: BigInt(blogWriter),
            };
            const blog = await this._blogService.updateBlog(updateBlog);
            // Return response
            return this.sendJSONResponse(res, blog ? 'Blog updated successfully' : 'Something went wrong', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getBlogWriter(req, res) {
        try {
            // Return response
            return this.sendJSONResponse(res, null, {
                length: 1,
            }, await this._blogService.getBlogWriter());
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async createBlogWriter(req, res) {
        try {
            const { name, emailId, designation, about, fbLink, instaLink, ytLink, } = req.body;
            const newBlogWriter = {
                name,
                profilePicture: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
                    : null,
                emailId,
                designation,
                about,
                fbLink,
                instaLink,
                ytLink,
            };
            const blogWriter = await this._blogService.createBlogWrite(newBlogWriter);
            // Return response
            return this.sendJSONResponse(res, 'Blog writer created successfully', {
                length: 1,
            }, blogWriter);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async deleteBlog(req, res) {
        try {
            const blogId = BigInt(req.params.blogId);
            const blog = await this._blogService.deleteBlog(blogId);
            // Return response
            return this.sendJSONResponse(res, 'Blog deleted successfully', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async deleteBlogwriter(req, res) {
        try {
            const id = BigInt(req.params.bwId);
            const blog = await this._blogService.deleteBlogWriter(id);
            // Return response
            return this.sendJSONResponse(res, 'Blog Writer deleted successfully', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
};
BlogController = __decorate([
    inversify_1.injectable()
], BlogController);
exports.default = BlogController;
