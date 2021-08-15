export declare type GetEvent = {
  id: bigint;
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  startAt: Date;
  endAt: Date | null;
  createdBy: bigint;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type NewEvent = {
  // id: bigint;
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  startAt: Date;
  endAt: Date | null;
  createdBy: bigint;
  // createdAt: Date;
  // updatedAt: Date | null;
};

export declare type UpdateEvent = {
  id: bigint;
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  startAt: Date;
  endAt: Date | null;
  createdBy: bigint;
  // createdAt: Date;
  // updatedAt: Date | null;
};
