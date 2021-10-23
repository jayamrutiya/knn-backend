export declare type GetDiscussion = {
  id: bigint;
  titleImage: string;
  question: string;
  description: string;
  createdBy: bigint;
  categoryId: bigint;
  createdAt: Date;
  updatedAt: Date | null;
  User?: any;
  DiscussionAnswer?: any;
};

export declare type NewDiscussion = {
  //   id: bigint;
  titleImage: string;
  question: string;
  description: string;
  createdBy: bigint;
  categoryId: bigint;
  //   createdAt: Date;
  //   updatedAt: Date | null;
};

export declare type UpdateDiscussion = {
  id: bigint;
  titleImage: string;
  question: string;
  description: string;
  createdBy: bigint;
  categoryId: bigint;
  //   createdAt: Date;
  //   updatedAt: Date | null;
};

export declare type GetDiscussionAnswer = {
  id: bigint;
  discussionId: bigint;
  answeredBy: bigint;
  answer: string;
  createdAt: Date;
};
