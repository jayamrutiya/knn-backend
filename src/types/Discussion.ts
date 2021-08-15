export declare type GetDiscussion = {
  id: bigint;
  titleImage: string;
  question: string;
  createdBy: bigint;
  categoryId: bigint;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type NewDiscussion = {
  //   id: bigint;
  titleImage: string;
  question: string;
  createdBy: bigint;
  categoryId: bigint;
  //   createdAt: Date;
  //   updatedAt: Date | null;
};
