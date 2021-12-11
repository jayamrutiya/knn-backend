"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const inversify_1 = require("inversify");
const events_1 = require("../config/events");
const express_1 = __importDefault(require("../config/express"));
const types_1 = require("../config/types");
const BadRequest_1 = require("../errors/BadRequest");
const NotFound_1 = require("../errors/NotFound");
const fs_1 = __importDefault(require("fs"));
const env_1 = __importDefault(require("../config/env"));
let EventService = class EventService {
    constructor(loggerService, eventRepository, roleRepository, userRepository, subscriptionRepository) {
        this._loggerService = loggerService;
        this._eventRepository = eventRepository;
        this._roleRepository = roleRepository;
        this._userRepository = userRepository;
        this._subscriptionRepository = subscriptionRepository;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async createEvent(newEvent) {
        const userRole = await this._roleRepository.getUserRole(newEvent.createdBy);
        if (userRole.Role !== 'Platform Admin') {
            throw new BadRequest_1.BadRequest('You are not Platform Admin');
        }
        return this._eventRepository.createEvent(newEvent);
    }
    async updateEvent(updateEvent) {
        const event = await this._eventRepository.getEvent(updateEvent.id);
        if (updateEvent.titleImage === 'no image') {
            updateEvent.titleImage = event.titleImage;
        }
        else {
            await fs_1.default.unlinkSync(`${env_1.default.DIRECTORY}${event.titleImage.split(/images/)[1]}`);
        }
        return this._eventRepository.updateEvent(updateEvent);
    }
    async getEvent(eventId) {
        return this._eventRepository.getEvent(eventId);
    }
    async getAllEvent(all) {
        return this._eventRepository.getAllEvent(all);
    }
    async eventRegistration(createEventRegistration) {
        const getUser = await this._userRepository.getUserById(createEventRegistration.userId);
        if (getUser === null) {
            throw new NotFound_1.NotFound('User not found');
        }
        const userEvent = await this._eventRepository.getUserRegisterEvent(createEventRegistration.userId, createEventRegistration.eventId);
        if (userEvent) {
            throw new BadRequest_1.BadRequest('You alredy register in this event');
        }
        const getEvent = await this._eventRepository.getEvent(createEventRegistration.eventId);
        if (getEvent.isActive === false) {
            throw new BadRequest_1.BadRequest('Event not activeted.');
        }
        if (getEvent.registrationEndAt &&
            getEvent.registrationEndAt?.getTime() > new Date().getTime()) {
            throw new BadRequest_1.BadRequest('Event registration is closed.');
        }
        createEventRegistration.isPaymentDone = getEvent.isFree;
        const eventRegistration = await this._eventRepository.eventRegistration(createEventRegistration);
        if (getEvent.isFree) {
            express_1.default.emit(events_1.EventTypes.SEND_EVENT_REGISTRATION, {
                eventName: getEvent.title,
                eventStartAt: getEvent.startAt,
                eventEndAt: getEvent.endAt,
                eventVenue: getEvent.venue,
                emailId: getUser.emailId,
            });
        }
        return eventRegistration;
    }
    async veifyUserEventPayment(eventRegistrationId, isPaymentDone) {
        const paymentDone = await this._eventRepository.veifyUserEventPayment(eventRegistrationId, isPaymentDone);
        const getEvent = await this._eventRepository.getEvent(paymentDone.eventId);
        const getUser = await this._userRepository.getUserById(paymentDone.userId);
        if (getUser === null) {
            throw new NotFound_1.NotFound('User Not Found');
        }
        const passOrFail = isPaymentDone ? 'Accepted' : 'Cancled';
        // if (isPaymentDone) {
        express_1.default.emit(events_1.EventTypes.SEND_EVENT_REGISTRATION, {
            eventName: `${getEvent.title}. Your registration is ${passOrFail}`,
            eventStartAt: getEvent.startAt,
            eventEndAt: getEvent.endAt,
            eventVenue: getEvent.venue,
            emailId: getUser.emailId,
        });
        // }
        return paymentDone;
    }
    async cretateNewEventBenefits(newEventBebefits) {
        const getEvent = await this._eventRepository.getEvent(newEventBebefits.eventId);
        return this._eventRepository.cretateNewEventBenefits(newEventBebefits);
    }
    async cretateNewEventSpeakers(newEventSpeakers) {
        const getEvent = await this._eventRepository.getEvent(newEventSpeakers.eventId);
        return this._eventRepository.cretateNewEventSpeakers(newEventSpeakers);
    }
    async createNewEventReq(newEventReq) {
        const getEvent = await this._eventRepository.getEvent(newEventReq.eventId);
        return this._eventRepository.createNewEventReq(newEventReq);
    }
    async createNewEventLearning(newEventLearning) {
        const getEvent = await this._eventRepository.getEvent(newEventLearning.eventId);
        return this._eventRepository.createNewEventLearning(newEventLearning);
    }
    async deleteEvent(eventId) {
        const getEvent = await this._eventRepository.getEvent(eventId);
        await fs_1.default.unlinkSync(`${env_1.default.DIRECTORY}${getEvent.titleImage.split(/images/)[1]}`);
        return this._eventRepository.deleteEvent(eventId);
    }
    async eventStatusChanged(eventId, status) {
        const getEvent = await this._eventRepository.getEvent(eventId);
        return this._eventRepository.eventStatusChanged(eventId, status);
    }
    async deleteBLRS(id, table) {
        return this._eventRepository.deleteBLRS(id, table);
    }
};
EventService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.EventRepository)),
    __param(2, inversify_1.inject(types_1.TYPES.RoleRepository)),
    __param(3, inversify_1.inject(types_1.TYPES.UserRepository)),
    __param(4, inversify_1.inject(types_1.TYPES.SubscriptionRepository))
], EventService);
exports.EventService = EventService;
