import { GetEvent, NewEvent, UpdateEvent } from '../types/Event';

export interface IEventService {
  createEvent(newEvent: NewEvent): Promise<GetEvent>;

  updateEvent(updateEvent: UpdateEvent): Promise<boolean>;

  getEvent(eventId: bigint): Promise<GetEvent>;

  getAllEvent(): Promise<GetEvent[]>;
}
