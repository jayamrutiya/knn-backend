import { injectable } from 'inversify';
import { IEventService } from '../interfaces/IEventService';
import { ILoggerService } from '../interfaces/ILoggerService';
import BaseController from './BaseController';
import * as express from 'express';
import {
  NewEvent,
  NewEventBenefits,
  NewEventLearning,
  NewEventRegistration,
  NewEventRequirements,
  NewEventSpeakers,
  UpdateEvent,
} from '../types/Event';
import ENV from '../config/env';

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
        videoLink,
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
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
          : 'no image',
        videoLink,
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
        videoLink,
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
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
          : 'no image',
        videoLink,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        shifts,
        eligibility,
        fee: parseInt(fee),
        venue,
        registrationEndAt: new Date(registrationEndAt),
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
      const all = req.query.all === 'true';

      console.log(all, 'all');

      const event = await this._eventService.getAllEvent(all);

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

  async cretateNewEventBenefits(req: express.Request, res: express.Response) {
    try {
      const { eventId, benefits } = req.body;

      const newEeventBenefits: NewEventBenefits = {
        eventId: BigInt(eventId),
        benefits,
      };

      const eventBenefits = await this._eventService.cretateNewEventBenefits(
        newEeventBenefits,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Benefits created successfully.',
        null,
        eventBenefits,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async cretateNewEventSpeakers(req: express.Request, res: express.Response) {
    try {
      const { eventId, name, designation, company } = req.body;

      const eventSpeakers: NewEventSpeakers = {
        eventId: BigInt(eventId),
        profilePicture: req.file
          ? `${ENV.APP_BASE_URL}:${ENV.PORT}${ENV.API_ROOT}/images/${req.file.filename}`
          : 'no image',
        name,
        designation,
        company,
      };

      const createEventSpeakers = await this._eventService.cretateNewEventSpeakers(
        eventSpeakers,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Speaker created successfully.',
        null,
        createEventSpeakers,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async createNewEventReq(req: express.Request, res: express.Response) {
    try {
      const { eventId, requirements } = req.body;

      const newEeventReq: NewEventRequirements = {
        eventId: BigInt(eventId),
        requirements,
      };

      const eventReq = await this._eventService.createNewEventReq(newEeventReq);

      // Return response
      return this.sendJSONResponse(
        res,
        'Requirements created successfully.',
        null,
        eventReq,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async createNewEventLearning(req: express.Request, res: express.Response) {
    try {
      const { eventId, learning } = req.body;

      const newEeventLearning: NewEventLearning = {
        eventId: BigInt(eventId),
        learning,
      };

      const eventLearning = await this._eventService.createNewEventLearning(
        newEeventLearning,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Learning created successfully.',
        null,
        eventLearning,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async deleteEvent(req: express.Request, res: express.Response) {
    try {
      const eventId = BigInt(req.params.eventId);

      const event = await this._eventService.deleteEvent(eventId);

      // Return response
      return this.sendJSONResponse(
        res,
        'Event deleted successfully',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async eventStatusChanged(req: express.Request, res: express.Response) {
    try {
      const eventId = BigInt(req.params.eventId);
      const status = req.body.status === true;

      const event = await this._eventService.eventStatusChanged(
        eventId,
        status,
      );

      // Return response
      return this.sendJSONResponse(
        res,
        'Event status successfully',
        null,
        null,
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }

  async deleteBLRS(req: express.Request, res: express.Response) {
    try {
      const eventId = BigInt(req.params.id);
      const table = req.query.table ? req.query.table.toString() : '';

      const blrs = await this._eventService.deleteBLRS(eventId, table);

      // Return response
      return this.sendJSONResponse(res, 'Deleted successfully', null, null);
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }
}
