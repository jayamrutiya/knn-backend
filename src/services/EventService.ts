import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { BadRequest } from '../errors/BadRequest';
import { IEventRepository } from '../interfaces/IEventRepository';
import { IEventService } from '../interfaces/IEventService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import { GetEvent, NewEvent, UpdateEvent } from '../types/Event';

@injectable()
export class EventService implements IEventService {
  private _loggerService: ILoggerService;

  private _eventRepository: IEventRepository;

  private _roleRepository: IRoleRepository;

  private _userRepository: IUserRepository;

  private _subscriptionRepository: ISubscriptionRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.EventRepository) eventRepository: IEventRepository,
    @inject(TYPES.RoleRepository) roleRepository: IRoleRepository,
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.SubscriptionRepository)
    subscriptionRepository: ISubscriptionRepository,
  ) {
    this._loggerService = loggerService;
    this._eventRepository = eventRepository;
    this._roleRepository = roleRepository;
    this._userRepository = userRepository;
    this._subscriptionRepository = subscriptionRepository;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async createEvent(newEvent: NewEvent): Promise<GetEvent> {
    const userRole = await this._roleRepository.getUserRole(newEvent.createdBy);
    if (userRole.Role !== 'Platform Admin') {
      throw new BadRequest('You are not Platform Admin');
    }

    return this._eventRepository.createEvent(newEvent);
  }

  async updateEvent(updateEvent: UpdateEvent): Promise<boolean> {
    await this._eventRepository.getEvent(updateEvent.id);
    return this._eventRepository.updateEvent(updateEvent);
  }

  async getEvent(eventId: bigint): Promise<GetEvent> {
    return this._eventRepository.getEvent(eventId);
  }

  async getAllEvent(): Promise<GetEvent[]> {
    return this._eventRepository.getAllEvent();
  }
}
