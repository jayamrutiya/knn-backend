import { Prisma, SubscriptionType } from '@prisma/client';

export declare type GetSubscription = {
  id: bigint;
  title: string;
  description: string | null;
  type: SubscriptionType;
  noOfBook: number;
  deposite: Prisma.Decimal;
  price: Prisma.Decimal;
};

export declare type CreateUserSubscription = {
  subscriptionId: bigint;
  userId: bigint;
  title: string;
  description: string | null;
  type: SubscriptionType;
  noOfBook: number;
  deposite: Prisma.Decimal;
  price: Prisma.Decimal;
};

export declare type GetUserSubscription = {
  id: bigint;
  subscriptionId: bigint;
  userId: bigint;
  title: string;
  description: string | null;
  type: SubscriptionType;
  noOfBook: number;
  deposite: Prisma.Decimal;
  price: Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type CreateUserSubscriptionUsage = {
  userSubscriptionId: bigint;
  noOfBookUploaded: number;
  priceDeposited: Prisma.Decimal;
};

export declare type GetUserSubscriptionUsage = {
  id: bigint;
  userSubscriptionId: bigint;
  noOfBookUploaded: number;
  priceDeposited: Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date | null;
};
