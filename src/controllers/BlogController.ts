import { injectable } from 'inversify';
import { IBlogService } from '../interfaces/IBlogService';
import { ILoggerService } from '../interfaces/ILoggerService';
import BaseController from './BaseController';
import * as express from 'express';
import { CreateBlogWriter, NewBlog, UpdateBlog } from '../types/Blog';

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
          ? 'http://127.0.0.1:3000/images/' + req.file.filename
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
      const blog = await this._blogService.getAllBlog();

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: blog.length,
        },
        blog,
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
          ? 'http://127.0.0.1:3000/images/' + req.file.filename
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
          ? 'http://127.0.0.1:3000/images/' + req.file.filename
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
}
