import {
  GetDiscussion,
  NewDiscussion,
  UpdateDiscussion,
} from '../types/Discussion';

export interface IDiscussionRepository {
  creatDiscussion(newDiscussion: NewDiscussion): Promise<GetDiscussion>;

  updateDiscussion(updateDiscussion: UpdateDiscussion): Promise<boolean>;

  getDiscussion(discussionId: bigint): Promise<GetDiscussion>;

  getAllDiscussion(): Promise<GetDiscussion[]>;
}
