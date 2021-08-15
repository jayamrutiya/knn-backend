import { inject, injectable } from 'inversify';
import moment from 'moment';
import { TYPES } from '../config/types';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFound } from '../errors/NotFound';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { IEventRepository } from '../interfaces/IEventRepository';
import { ILoggerService } from '../interfaces/ILoggerService';
import { GetEvent, NewEvent, UpdateEvent } from '../types/Event';

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
          startAt: newEvent.startAt,
          endAt: newEvent.endAt,
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
          startAt: updateEvent.startAt,
          endAt: updateEvent.endAt,
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

      const event = await client.event.findMany({});

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
}
