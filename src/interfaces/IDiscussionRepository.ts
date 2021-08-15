import { GetDiscussion, NewDiscussion } from '../types/Discussion';

export interface IDiscussionRepository {
  creatDiscussion(newDiscussion: NewDiscussion): Promise<GetDiscussion>;
}
