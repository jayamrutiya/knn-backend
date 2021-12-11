"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const BaseController_1 = __importDefault(require("./BaseController"));
const env_1 = __importDefault(require("../config/env"));
let EventController = class EventController extends BaseController_1.default {
    constructor(loggerService, eventService) {
        super();
        this._loggerService = loggerService;
        this._eventService = eventService;
        this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
    }
    async createEvent(req, res) {
        try {
            const { title, subTitle, videoLink, body, startAt, endAt, shifts, eligibility, fee, venue, registrationEndAt, createdBy, } = req.body;
            const newEvent = {
                title,
                subTitle,
                body,
                titleImage: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
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
            return this.sendJSONResponse(res, 'Event created successfully', {
                length: 1,
            }, event);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async updateEvent(req, res) {
        try {
            const { title, subTitle, videoLink, body, startAt, endAt, createdBy, shifts, eligibility, fee, venue, registrationEndAt, } = req.body;
            const updateEvent = {
                id: BigInt(req.params.id),
                title,
                subTitle,
                body,
                titleImage: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
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
            return this.sendJSONResponse(res, 'Event updated successfully', {
                length: 1,
            }, event);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getEvent(req, res) {
        try {
            const eventId = BigInt(req.params.id);
            const event = await this._eventService.getEvent(eventId);
            // Return response
            return this.sendJSONResponse(res, null, {
                length: 1,
            }, event);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async getAllEvent(req, res) {
        try {
            const all = req.query.all === 'true';
            console.log(all, 'all');
            const event = await this._eventService.getAllEvent(all);
            // Return response
            return this.sendJSONResponse(res, null, {
                length: event.length,
            }, event);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async eventRegistration(req, res) {
        try {
            const { eventId, userId } = req.body;
            const createEventRegistration = {
                eventId: BigInt(eventId),
                userId: BigInt(userId),
                isPaymentDone: false,
            };
            const eventRegistration = await this._eventService.eventRegistration(createEventRegistration);
            // Return response
            return this.sendJSONResponse(res, eventRegistration
                ? 'Successfully register in event.'
                : 'Something went wrong', null, eventRegistration);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async veifyUserEventPayment(req, res) {
        try {
            const { eventRegistrationId, isPaymentDone } = req.body;
            const paymentDone = await this._eventService.veifyUserEventPayment(BigInt(eventRegistrationId), isPaymentDone);
            // Return response
            return this.sendJSONResponse(res, isPaymentDone ? 'Event payment verify.' : 'Event payment not verify.', null, isPaymentDone);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async cretateNewEventBenefits(req, res) {
        try {
            const { eventId, benefits } = req.body;
            const newEeventBenefits = {
                eventId: BigInt(eventId),
                benefits,
            };
            const eventBenefits = await this._eventService.cretateNewEventBenefits(newEeventBenefits);
            // Return response
            return this.sendJSONResponse(res, 'Benefits created successfully.', null, eventBenefits);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async cretateNewEventSpeakers(req, res) {
        try {
            const { eventId, name, designation, company } = req.body;
            const eventSpeakers = {
                eventId: BigInt(eventId),
                profilePicture: req.file
                    ? `${env_1.default.APP_BASE_URL}:${env_1.default.PORT}${env_1.default.API_ROOT}/images/${req.file.filename}`
                    : 'no image',
                name,
                designation,
                company,
            };
            const createEventSpeakers = await this._eventService.cretateNewEventSpeakers(eventSpeakers);
            // Return response
            return this.sendJSONResponse(res, 'Speaker created successfully.', null, createEventSpeakers);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async createNewEventReq(req, res) {
        try {
            const { eventId, requirements } = req.body;
            const newEeventReq = {
                eventId: BigInt(eventId),
                requirements,
            };
            const eventReq = await this._eventService.createNewEventReq(newEeventReq);
            // Return response
            return this.sendJSONResponse(res, 'Requirements created successfully.', null, eventReq);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async createNewEventLearning(req, res) {
        try {
            const { eventId, learning } = req.body;
            const newEeventLearning = {
                eventId: BigInt(eventId),
                learning,
            };
            const eventLearning = await this._eventService.createNewEventLearning(newEeventLearning);
            // Return response
            return this.sendJSONResponse(res, 'Learning created successfully.', null, eventLearning);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async deleteEvent(req, res) {
        try {
            const eventId = BigInt(req.params.eventId);
            const event = await this._eventService.deleteEvent(eventId);
            // Return response
            return this.sendJSONResponse(res, 'Event deleted successfully', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async eventStatusChanged(req, res) {
        try {
            const eventId = BigInt(req.params.eventId);
            const status = req.body.status === true;
            const event = await this._eventService.eventStatusChanged(eventId, status);
            // Return response
            return this.sendJSONResponse(res, 'Event status successfully', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
    async deleteBLRS(req, res) {
        try {
            const eventId = BigInt(req.params.id);
            const table = req.query.table ? req.query.table.toString() : '';
            const blrs = await this._eventService.deleteBLRS(eventId, table);
            // Return response
            return this.sendJSONResponse(res, 'Deleted successfully', null, null);
        }
        catch (error) {
            return this.sendErrorResponse(req, res, error);
        }
    }
};
EventController = __decorate([
    inversify_1.injectable()
], EventController);
exports.default = EventController;
