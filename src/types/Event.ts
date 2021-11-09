export declare type GetEvent = {
  id: bigint;
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  videoLink: string | null;
  startAt: Date;
  endAt: Date | null;
  shifts: string;
  eligibility: string;
  isFree: boolean;
  fee: number;
  venue: string;
  registrationEndAt: Date | null;
  createdBy: bigint;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type NewEvent = {
  // id: bigint
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  videoLink: string | null;
  startAt: Date;
  endAt: Date | null;
  shifts: string;
  eligibility: string;
  // isFree: boolean;
  fee: number;
  venue: string;
  registrationEndAt: Date | null;
  createdBy: bigint;
  // isActive: boolean
  // createdAt: Date
  // updatedAt: Date | null
};

export declare type UpdateEvent = {
  id: bigint;
  title: string;
  subTitle: string;
  body: string;
  titleImage: string;
  videoLink: string | null;
  startAt: Date;
  endAt: Date | null;
  shifts: string;
  eligibility: string;
  fee: number;
  venue: string;
  registrationEndAt: Date | null;
  createdBy: bigint;
  // createdAt: Date;
  // updatedAt: Date | null;
};

export declare type NewEventRegistration = {
  // id: bigint
  eventId: bigint;
  userId: bigint;
  isPaymentDone: boolean;
  // createdAt: Date
};
