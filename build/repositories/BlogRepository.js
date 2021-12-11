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
exports.BlogRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const InternalServerError_1 = require("../errors/InternalServerError");
const NotFound_1 = require("../errors/NotFound");
let BlogRepository = class BlogRepository {
    constructor(loggerService, databaseService) {
        this._loggerService = loggerService;
        this._databaseService = databaseService;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async createBlog(newBlog) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const blog = await client.blog.create({
                data: {
                    title: newBlog.title,
                    subTitle: newBlog.subTitle,
                    body: newBlog.body,
                    titleImage: newBlog.titleImage,
                    blogWriter: newBlog.blogWriter,
                },
                include: {
                    BlogWriter: true,
                },
            });
            return blog;
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
    async updateBlog(updateBlog) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const blog = await client.blog.update({
                where: {
                    id: updateBlog.id,
                },
                data: {
                    title: updateBlog.title,
                    subTitle: updateBlog.subTitle,
                    body: updateBlog.body,
                    titleImage: updateBlog.titleImage,
                    blogWriter: updateBlog.blogWriter,
                },
            });
            return blog !== null;
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
    async getBlog(blogId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const blog = await client.blog.findFirst({
                where: {
                    id: blogId,
                },
                include: {
                    BlogWriter: true,
                },
            });
            if (blog === null) {
                throw new NotFound_1.NotFound(`Blog not found with id ${blogId}`);
            }
            return blog;
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
    async getAllBlog() {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const blog = await client.blog.findMany({
                include: {
                    BlogWriter: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return blog;
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
    async createBlogWrite(newCreateBlogWriter) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const blogWriter = await client.blogWriter.create({
                data: {
                    name: newCreateBlogWriter.name,
                    profilePicture: newCreateBlogWriter.profilePicture,
                    emailId: newCreateBlogWriter.emailId,
                    designation: newCreateBlogWriter.designation,
                    about: newCreateBlogWriter.about,
                    fbLink: newCreateBlogWriter.fbLink,
                    instaLink: newCreateBlogWriter.instaLink,
                    ytLink: newCreateBlogWriter.ytLink,
                },
            });
            return blogWriter;
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
    async deleteBlog(blogId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const blog = await client.blog.delete({
                where: {
                    id: blogId,
                },
            });
            return blog !== null;
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
    async getBlogWriter() {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const blogWriter = await client.blogWriter.findMany({});
            return blogWriter;
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
    async deleteBlogWriter(id) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const blogWriter = await client.blogWriter.delete({
                where: {
                    id,
                },
            });
            return blogWriter !== null;
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
    async getBlogByBlogWriter(blogWriterId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const blogs = await client.blog.findMany({
                where: {
                    blogWriter: blogWriterId,
                },
            });
            return blogs;
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
BlogRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.DatabaseService))
], BlogRepository);
exports.BlogRepository = BlogRepository;
