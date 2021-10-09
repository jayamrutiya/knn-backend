import { inject, injectable } from 'inversify';
import { EventTypes } from '../config/events';
import app from '../config/express';
import { TYPES } from '../config/types';
import { BadRequest } from '../errors/BadRequest';
import { NotFound } from '../errors/NotFound';
import { IEventRepository } from '../interfaces/IEventRepository';
import { IEventService } from '../interfaces/IEventService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { IUserRepository } from '../interfaces/IUserRepository';
import {
  GetEvent,
  NewEvent,
  NewEventRegistration,
  UpdateEvent,
} from '../types/Event';

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

  async eventRegistration(
    createEventRegistration: NewEventRegistration,
  ): Promise<boolean> {
    const getUser = await this._userRepository.getUserById(
      createEventRegistration.userId,
    );

    if (getUser === null) {
      throw new NotFound('User not found');
    }

    const userEvent = await this._eventRepository.getUserRegisterEvent(
      createEventRegistration.userId,
      createEventRegistration.eventId,
    );

    if (userEvent) {
      throw new BadRequest('You alredy register in this event');
    }

    const getEvent = await this._eventRepository.getEvent(
      createEventRegistration.eventId,
    );

    if (getEvent.isActive === false) {
      throw new BadRequest('Event not activeted.');
    }

    if (
      getEvent.registrationEndAt &&
      getEvent.registrationEndAt?.getTime() > new Date().getTime()
    ) {
      throw new BadRequest('Event registration is closed.');
    }

    createEventRegistration.isPaymentDone = getEvent.isFree;

    const eventRegistration = await this._eventRepository.eventRegistration(
      createEventRegistration,
    );

    if (getEvent.isFree) {
      app.emit(EventTypes.SEND_EVENT_REGISTRATION, {
        eventName: getEvent.title,
        eventStartAt: getEvent.startAt,
        eventEndAt: getEvent.endAt,
        eventVenue: getEvent.venue,
        emailId: getUser.emailId,
      });
    }

    return eventRegistration;
  }

  async veifyUserEventPayment(
    eventRegistrationId: bigint,
    isPaymentDone: boolean,
  ): Promise<any> {
    const paymentDone = await this._eventRepository.veifyUserEventPayment(
      eventRegistrationId,
      isPaymentDone,
    );

    const getEvent = await this._eventRepository.getEvent(paymentDone.eventId);

    const getUser = await this._userRepository.getUserById(paymentDone.userId);

    if (getUser === null) {
      throw new NotFound('User Not Found');
    }

    if (isPaymentDone) {
      app.emit(EventTypes.SEND_EVENT_REGISTRATION, {
        eventName: getEvent.title,
        eventStartAt: getEvent.startAt,
        eventEndAt: getEvent.endAt,
        eventVenue: getEvent.venue,
        emailId: getUser.emailId,
      });
    }

    return paymentDone;
  }
}
