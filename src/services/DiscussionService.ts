import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { IDiscussionRepository } from '../interfaces/IDiscussionRepository';
import { IDiscussionService } from '../interfaces/IDiscussionService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import {
  GetDiscussion,
  NewDiscussion,
  UpdateDiscussion,
} from '../types/Discussion';

@injectable()
export class DiscussionService implements IDiscussionService {
  private _loggerService: ILoggerService;

  private _discussionRepository: IDiscussionRepository;

  private _roleRepository: IRoleRepository;

  private _userRepository: IUserRepository;

  private _subscriptionRepository: ISubscriptionRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.DiscussionRepository)
    discussionRepository: IDiscussionRepository,
    @inject(TYPES.RoleRepository) roleRepository: IRoleRepository,
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.SubscriptionRepository)
    subscriptionRepository: ISubscriptionRepository,
  ) {
    this._loggerService = loggerService;
    this._discussionRepository = discussionRepository;
    this._roleRepository = roleRepository;
    this._userRepository = userRepository;
    this._subscriptionRepository = subscriptionRepository;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async creatDiscussion(newDiscussion: NewDiscussion): Promise<GetDiscussion> {
    return this._discussionRepository.creatDiscussion(newDiscussion);
  }

  async updateDiscussion(updateDiscussion: UpdateDiscussion): Promise<boolean> {
    return this._discussionRepository.updateDiscussion(updateDiscussion);
  }

  async getDiscussion(discussionId: bigint): Promise<GetDiscussion> {
    return this._discussionRepository.getDiscussion(discussionId);
  }

  async getAllDiscussion(): Promise<GetDiscussion[]> {
    return this._discussionRepository.getAllDiscussion();
  }
}
