import { injectable } from 'inversify';
import { IBlogService } from '../interfaces/IBlogService';
import { ILoggerService } from '../interfaces/ILoggerService';
import BaseController from './BaseController';
import * as express from 'express';
import { CreateBlogWriter, NewBlog, UpdateBlog } from '../types/Blog';
import ENV from '../config/env';

@injectable()
export default class BlogController extends BaseController {
  private _loggerService: ILoggerService;

  private _blogService: IBlogService;

  constructor(loggerService: ILoggerService, blogService: IBlogService) {
    super();
    this._loggerService = loggerService;
    this._blogService = blogService;
    this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
  }

  async createBlog(req: express.Request, res: express.Response) {
    try {
      const { title, subTitle, body, blogWriter } = req.body;

      const newBlog: NewBlog = {
        title,
        subTitle,
        body,
        titleImage: req.file
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
          : 'no image',
        blogWriter: BigInt(blogWriter),
      };

      const blog = await this._blogService.createBlog(newBlog);

      // Return response
      return this.sendJSONResponse(
        res,
        'Blog created successfully',
        {
          length: 1,
        },
        blog,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getBlog(req: express.Request, res: express.Response) {
    try {
      const blogId = BigInt(req.params.id);

      const blog = await this._blogService.getBlog(blogId);

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: 1,
        },
        blog,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getAllBlog(req: express.Request, res: express.Response) {
    try {
      const page =
        typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 0;
      const size =
        typeof req.query.size === 'string' ? parseInt(req.query.size, 10) : 0;

      const blog = await this._blogService.getAllBlog(page, size);

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          page,
          size,
          length: blog.blog.length,
          total: blog.metaData.total,
        },
        blog.blog,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async updateBlog(req: express.Request, res: express.Response) {
    try {
      const { title, subTitle, body, blogWriter } = req.body;

      const updateBlog: UpdateBlog = {
        id: BigInt(req.params.id),
        title,
        subTitle,
        body,
        titleImage: req.file
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
          : 'no image',
        blogWriter: BigInt(blogWriter),
      };

      const blog = await this._blogService.updateBlog(updateBlog);

      // Return response
      return this.sendJSONResponse(
        res,
        blog ? 'Blog updated successfully' : 'Something went wrong',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getBlogWriter(req: express.Request, res: express.Response) {
    try {
      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: 1,
        },
        await this._blogService.getBlogWriter(),
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async createBlogWriter(req: express.Request, res: express.Response) {
    try {
      const {
        name,
        emailId,
        designation,
        about,
        fbLink,
        instaLink,
        ytLink,
      } = req.body;

      const newBlogWriter: CreateBlogWriter = {
        name,
        profilePicture: req.file
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
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
      return this.sendJSONResponse(
        res,
        'Blog writer created successfully',
        {
          length: 1,
        },
        blogWriter,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async deleteBlog(req: express.Request, res: express.Response) {
    try {
      const blogId = BigInt(req.params.blogId);

      const blog = await this._blogService.deleteBlog(blogId);

      // Return response
      return this.sendJSONResponse(
        res,
        'Blog deleted successfully',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async deleteBlogwriter(req: express.Request, res: express.Response) {
    try {
      const id = BigInt(req.params.bwId);

      const blog = await this._blogService.deleteBlogWriter(id);

      // Return response
      return this.sendJSONResponse(
        res,
        'Blog Writer deleted successfully',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }
}
