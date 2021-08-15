import { GetDiscussion, NewDiscussion } from '../types/Discussion';

export interface IDiscussionService {
  creatDiscussion(newDiscussion: NewDiscussion): Promise<GetDiscussion>;
}
