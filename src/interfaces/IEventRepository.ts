import {
  GetEvent,
  NewEvent,
  NewEventBenefits,
  NewEventLearning,
  NewEventRegistration,
  NewEventRequirements,
  NewEventSpeakers,
  UpdateEvent,
} from '../types/Event';

export interface IEventRepository {
  createEvent(newEvent: NewEvent): Promise<GetEvent>;

  updateEvent(updateEvent: UpdateEvent): Promise<boolean>;

  getEvent(eventId: bigint): Promise<GetEvent>;

  getAllEvent(all: boolean): Promise<GetEvent[]>;

  eventRegistration(
    createEventRegistration: NewEventRegistration,
  ): Promise<boolean>;

  veifyUserEventPayment(
    eventRegistrationId: bigint,
    isPaymentDone: boolean,
  ): Promise<any>;

  getUserRegisterEvent(userId: bigint, eventId: bigint): Promise<boolean>;

  cretateNewEventBenefits(newEventBebefits: NewEventBenefits): Promise<any>;

  cretateNewEventSpeakers(newEventSpeakers: NewEventSpeakers): Promise<any>;

  createNewEventReq(newEventReq: NewEventRequirements): Promise<any>;

  createNewEventLearning(newEventLearning: NewEventLearning): Promise<any>;

  deleteEvent(eventId: bigint): Promise<boolean>;

  eventStatusChanged(eventId: bigint, status: boolean): Promise<boolean>;
}
