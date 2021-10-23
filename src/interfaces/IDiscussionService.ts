import {
  GetDiscussion,
  GetDiscussionAnswer,
  NewDiscussion,
  UpdateDiscussion,
} from '../types/Discussion';

export interface IDiscussionService {
  creatDiscussion(newDiscussion: NewDiscussion): Promise<GetDiscussion>;

  updateDiscussion(updateDiscussion: UpdateDiscussion): Promise<boolean>;

  getDiscussion(discussionId: bigint): Promise<GetDiscussion>;

  getAllDiscussion(categoryId: bigint | null): Promise<GetDiscussion[]>;

  createAnswer(
    discussionId: bigint,
    answeredBy: bigint,
    answer: string,
  ): Promise<GetDiscussionAnswer>;
}
