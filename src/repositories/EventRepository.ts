import { inject, injectable } from 'inversify';
import moment from 'moment';
import { TYPES } from '../config/types';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFound } from '../errors/NotFound';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { IEventRepository } from '../interfaces/IEventRepository';
import { ILoggerService } from '../interfaces/ILoggerService';
import {
  GetEvent,
  NewEvent,
  NewEventRegistration,
  UpdateEvent,
} from '../types/Event';

@injectable()
export class EventRepository implements IEventRepository {
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

  async createEvent(newEvent: NewEvent): Promise<GetEvent> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const event = await client.event.create({
        data: {
          title: newEvent.title,
          subTitle: newEvent.subTitle,
          body: newEvent.body,
          titleImage: newEvent.titleImage,
          videoLink: newEvent.videoLink,
          startAt: newEvent.startAt,
          endAt: newEvent.endAt,
          shifts: newEvent.shifts,
          eligibility: newEvent.eligibility,
          fee: newEvent.fee,
          isFree: newEvent.fee == 0,
          venue: newEvent.venue,
          registrationEndAt: newEvent.registrationEndAt,
          createdBy: newEvent.createdBy,
        },
      });

      return event;
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

  async updateEvent(updateEvent: UpdateEvent): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const event = await client.event.update({
        where: {
          id: updateEvent.id,
        },
        data: {
          title: updateEvent.title,
          subTitle: updateEvent.subTitle,
          body: updateEvent.body,
          titleImage: updateEvent.titleImage,
          videoLink: updateEvent.videoLink,
          startAt: updateEvent.startAt,
          endAt: updateEvent.endAt,
          shifts: updateEvent.shifts,
          eligibility: updateEvent.eligibility,
          fee: updateEvent.fee,
          isFree: updateEvent.fee == 0,
          venue: updateEvent.venue,
          registrationEndAt: updateEvent.registrationEndAt,
          updatedAt: moment().format(),
        },
      });

      return event !== null;
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

  async getEvent(eventId: bigint): Promise<GetEvent> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const event = await client.event.findFirst({
        where: {
          id: eventId,
        },
        include: {
          EventBenefits: true,
          EventLearning: true,
          EventRequirements: true,
          EventSpeakers: true,
        },
      });

      if (event == null) {
        throw new NotFound(`Event not found with id ${eventId}`);
      }

      return event;
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

  async getAllEvent(): Promise<GetEvent[]> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const event = await client.event.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return event;
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

  async eventRegistration(
    createEventRegistration: NewEventRegistration,
  ): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const eventRegistration = await client.eventRegistration.create({
        data: {
          eventId: createEventRegistration.eventId,
          userId: createEventRegistration.userId,
          isPaymentDone: createEventRegistration.isPaymentDone,
        },
      });

      return eventRegistration != null;
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

  async veifyUserEventPayment(
    eventRegistrationId: bigint,
    isPaymentDone: boolean,
  ): Promise<any> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const paymentDone = await client.eventRegistration.update({
        where: {
          id: eventRegistrationId,
        },
        data: {
          isPaymentDone,
          updatedAt: moment().format(),
        },
        select: {
          eventId: true,
          userId: true,
        },
      });

      return paymentDone;
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

  async getUserRegisterEvent(
    userId: bigint,
    eventId: bigint,
  ): Promise<boolean> {
    try {
      // Get the database client
      const client = this._databaseService.Client();

      const userEvent = await client.eventRegistration.findFirst({
        where: {
          userId,
          eventId,
        },
      });

      return userEvent !== null;
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
