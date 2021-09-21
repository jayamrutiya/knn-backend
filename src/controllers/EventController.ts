import { injectable } from 'inversify';
import { IEventService } from '../interfaces/IEventService';
import { ILoggerService } from '../interfaces/ILoggerService';
import BaseController from './BaseController';
import * as express from 'express';
import { NewEvent, NewEventRegistration, UpdateEvent } from '../types/Event';

@injectable()
export default class EventController extends BaseController {
  private _loggerService: ILoggerService;

  private _eventService: IEventService;

  constructor(loggerService: ILoggerService, eventService: IEventService) {
    super();
    this._loggerService = loggerService;
    this._eventService = eventService;
    this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
  }

  async createEvent(req: express.Request, res: express.Response) {
    try {
      const {
        title,
        subTitle,
        body,
        startAt,
        endAt,
        shifts,
        eligibility,
        fee,
        venue,
        registrationEndAt,
        createdBy,
      } = req.body;

      const newEvent: NewEvent = {
        title,
        subTitle,
        body,
        titleImage: req.file
          ? 'http://127.0.0.1:3000/images/' + req.file.filename
          : 'no image',
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        shifts,
        eligibility,
        fee: parseInt(fee),
        venue,
        registrationEndAt: new Date(registrationEndAt),
        createdBy: BigInt(createdBy),
      };

      const event = await this._eventService.createEvent(newEvent);

      // Return response
      return this.sendJSONResponse(
        res,
        'Event created successfully',
        {
          length: 1,
        },
        event,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async updateEvent(req: express.Request, res: express.Response) {
    try {
      const {
        title,
        subTitle,
        body,
        startAt,
        endAt,
        createdBy,
        shifts,
        eligibility,
        fee,
        venue,
        registrationEndAt,
      } = req.body;

      const updateEvent: UpdateEvent = {
        id: BigInt(req.params.id),
        title,
        subTitle,
        body,
        titleImage: req.file
          ? 'http://127.0.0.1:3000/images/' + req.file.filename
          : 'no image',
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        shifts,
        eligibility,
        fee,
        venue,
        registrationEndAt,
        createdBy: BigInt(createdBy),
      };

      const event = await this._eventService.updateEvent(updateEvent);

      // Return response
      return this.sendJSONResponse(
        res,
        'Event updated successfully',
        {
          length: 1,
        },
        event,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getEvent(req: express.Request, res: express.Response) {
    try {
      const eventId = BigInt(req.params.id);

      const event = await this._eventService.getEvent(eventId);

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: 1,
        },
        event,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async getAllEvent(req: express.Request, res: express.Response) {
    try {
      const event = await this._eventService.getAllEvent();

      // Return response
      return this.sendJSONResponse(
        res,
        null,
        {
          length: event.length,
        },
        event,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async eventRegistration(req: express.Request, res: express.Response) {
    try {
      const { eventId, userId } = req.body;

      const createEventRegistration: NewEventRegistration = {
        eventId: BigInt(eventId),
        userId: BigInt(userId),
        isPaymentDone: false,
      };

      const eventRegistration = await this._eventService.eventRegistration(
        createEventRegistration,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        eventRegistration
          ? 'Successfully register in event.'
          : 'Something went wrong',
        null,
        eventRegistration,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async veifyUserEventPayment(req: express.Request, res: express.Response) {
    try {
      const { eventRegistrationId, isPaymentDone } = req.body;

      const paymentDone = await this._eventService.veifyUserEventPayment(
        BigInt(eventRegistrationId),
        isPaymentDone,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        isPaymentDone ? 'Event payment verify.' : 'Event payment not verify.',
        null,
        isPaymentDone,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }
}
