import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import IBlogRepository from '../interfaces/IBlogRepository';
import IBlogService from '../interfaces/IBlogService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { GetBlog, NewBlog, UpdateBlog } from '../types/Blog';

@injectable()
export class BlogService implements IBlogService {
  private _loggerService: ILoggerService;

  private _blogRepository: IBlogRepository;

  private _roleRepository: IRoleRepository;

  private _userRepository: IUserRepository;

  private _subscriptionRepository: ISubscriptionRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.BlogRepository) blogRepository: IBlogRepository,
    @inject(TYPES.RoleRepository) roleRepository: IRoleRepository,
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.SubscriptionRepository)
    subscriptionRepository: ISubscriptionRepository,
  ) {
    this._loggerService = loggerService;
    this._blogRepository = blogRepository;
    this._roleRepository = roleRepository;
    this._userRepository = userRepository;
    this._subscriptionRepository = subscriptionRepository;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async createBlog(newBlog: NewBlog): Promise<GetBlog> {
    return this._blogRepository.createBlog(newBlog);
  }

  async getBlog(blogId: bigint): Promise<GetBlog> {
    return this._blogRepository.getBlog(blogId);
  }

  async getAllBlog(): Promise<GetBlog[]> {
    return this._blogRepository.getAllBlog();
  }

  async updateBlog(updateBlog: UpdateBlog): Promise<boolean> {
    await this._blogRepository.getBlog(updateBlog.id);
    return this._blogRepository.updateBlog(updateBlog);
  }
}
