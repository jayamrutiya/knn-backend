export declare type GetBlog = {
  id: bigint;
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  createdBy: bigint;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type NewBlog = {
  // id: bigint;
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  createdBy: bigint;
  // createdAt: Date;
  // updatedAt: Date | null;
};

export declare type UpdateBlog = {
  id: bigint;
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  createdBy: bigint;
  // createdAt: Date;
  // updatedAt: Date | null;
};
