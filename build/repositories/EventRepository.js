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
exports.EventRepository = void 0;
const inversify_1 = require("inversify");
const moment_1 = __importDefault(require("moment"));
const types_1 = require("../config/types");
const InternalServerError_1 = require("../errors/InternalServerError");
const NotFound_1 = require("../errors/NotFound");
let EventRepository = class EventRepository {
    constructor(loggerService, databaseService) {
        this._loggerService = loggerService;
        this._databaseService = databaseService;
        this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
    }
    async createEvent(newEvent) {
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
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async updateEvent(updateEvent) {
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
                    updatedAt: moment_1.default().format(),
                },
            });
            return event !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getEvent(eventId) {
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
                    EventRegistration: {
                        include: {
                            User: true,
                        },
                    },
                },
            });
            if (event == null) {
                throw new NotFound_1.NotFound(`Event not found with id ${eventId}`);
            }
            return event;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getAllEvent(all) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const event = await client.event.findMany({
                where: all === false
                    ? {
                        isActive: true,
                    }
                    : {},
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return event;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async deleteEvent(eventId) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            await client.eventBenefits.deleteMany({
                where: {
                    eventId,
                },
            });
            await client.eventLearning.deleteMany({
                where: {
                    eventId,
                },
            });
            await client.eventRequirements.deleteMany({
                where: {
                    eventId,
                },
            });
            await client.eventRequirements.deleteMany({
                where: {
                    eventId,
                },
            });
            await client.eventSpeakers.deleteMany({
                where: {
                    eventId,
                },
            });
            const deleteEvent = await client.event.delete({
                where: {
                    id: eventId,
                },
            });
            return deleteEvent !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async eventRegistration(createEventRegistration) {
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
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async veifyUserEventPayment(eventRegistrationId, isPaymentDone) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const paymentDone = await client.eventRegistration.update({
                where: {
                    id: eventRegistrationId,
                },
                data: {
                    isPaymentDone,
                    updatedAt: moment_1.default().format(),
                },
                select: {
                    eventId: true,
                    userId: true,
                },
            });
            return paymentDone;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async getUserRegisterEvent(userId, eventId) {
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
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async cretateNewEventBenefits(newEventBebefits) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const eventBenefits = await client.eventBenefits.create({
                data: {
                    eventId: newEventBebefits.eventId,
                    benefits: newEventBebefits.benefits,
                },
            });
            return eventBenefits;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async cretateNewEventSpeakers(newEventSpeakers) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const eventSpeakers = await client.eventSpeakers.create({
                data: {
                    eventId: newEventSpeakers.eventId,
                    name: newEventSpeakers.name,
                    profilePicture: newEventSpeakers.profilePicture,
                    designation: newEventSpeakers.designation,
                    company: newEventSpeakers.company,
                },
            });
            return eventSpeakers;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async createNewEventReq(newEventReq) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const eventRequirements = await client.eventRequirements.create({
                data: {
                    eventId: newEventReq.eventId,
                    requirements: newEventReq.requirements,
                },
            });
            return eventRequirements;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async createNewEventLearning(newEventLearning) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const eventLearning = await client.eventLearning.create({
                data: {
                    eventId: newEventLearning.eventId,
                    learning: newEventLearning.learning,
                },
            });
            return eventLearning;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async eventStatusChanged(eventId, status) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            const eventStatus = await client.event.update({
                where: {
                    id: eventId,
                },
                data: {
                    isActive: status,
                },
            });
            return eventStatus !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
    async deleteBLRS(id, table) {
        try {
            // Get the database client
            const client = this._databaseService.Client();
            let returnObject = false;
            if (table === 'Benefits') {
                returnObject = await client.eventBenefits.delete({
                    where: {
                        id,
                    },
                });
            }
            if (table === 'Learning') {
                returnObject = await client.eventLearning.delete({
                    where: {
                        id,
                    },
                });
            }
            if (table === 'Requirement') {
                returnObject = await client.eventRequirements.delete({
                    where: {
                        id,
                    },
                });
            }
            if (table === 'Speaker') {
                returnObject = await client.eventSpeakers.delete({
                    where: {
                        id,
                    },
                });
            }
            return returnObject !== null;
        }
        catch (error) {
            this._loggerService.getLogger().error(`Error ${error}`);
            if (error instanceof NotFound_1.NotFound) {
                throw error;
            }
            throw new InternalServerError_1.InternalServerError('An error occurred while interacting with the database.');
        }
        finally {
            await this._databaseService.disconnect();
        }
    }
};
EventRepository = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.LoggerService)),
    __param(1, inversify_1.inject(types_1.TYPES.DatabaseService))
], EventRepository);
exports.EventRepository = EventRepository;
