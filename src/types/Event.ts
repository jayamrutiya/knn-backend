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

export declare type NewEventBenefits = {
  // id: bigint;
  eventId: bigint;
  benefits: string;
  // createdAt: Date;
};

export declare type NewEventSpeakers = {
  // id: bigint;
  eventId: bigint;
  profilePicture: string;
  name: string;
  designation: string;
  company: string;
  // createdAt: Date;
};

export declare type NewEventRequirements = {
  // id: bigint;
  eventId: bigint;
  requirements: string;
  // createdAt: Date;
};

export declare type NewEventLearning = {
  // id: bigint;
  eventId: bigint;
  learning: string;
  // createdAt: Date;
};
