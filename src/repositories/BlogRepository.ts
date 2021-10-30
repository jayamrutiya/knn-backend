import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFound } from '../errors/NotFound';
import { IBlogRepository } from '../interfaces/IBlogRepository';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { ILoggerService } from '../interfaces/ILoggerService';
import {
  CreateBlogWriter,
  GetBlog,
  GetBlogWriter,
  NewBlog,
  UpdateBlog,
} from '../types/Blog';

@injectable()
export class BlogRepository implements IBlogRepository {
  private _loggerService: ILoggerService;

  private _databaseService: IDatabaseService;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.DatabaseService) databaseService: IDatabaseService,
  ) {
    this._loggerService = loggerService;
    this._databaseService = databaseService;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async createBlog(newBlog: NewBlog): Promise<GetBlog> {
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
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async updateBlog(updateBlog: UpdateBlog): Promise<boolean> {
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
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getBlog(blogId: bigint): Promise<GetBlog> {
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
        throw new NotFound(`Blog not found with id ${blogId}`);
      }

      return blog;
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async getAllBlog(): Promise<GetBlog[]> {
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
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }

  async createBlogWrite(
    newCreateBlogWriter: CreateBlogWriter,
  ): Promise<GetBlogWriter> {
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
    } catch (error) {
      this._loggerService.getLogger().error(`Error ${error}`);
      if (error instanceof NotFound) {
        throw error;
      }
      throw new InternalServerError(
        'An error occurred while interacting with the database.',
      );
    } finally {
      await this._databaseService.disconnect();
    }
  }
}
