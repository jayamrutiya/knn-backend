import { Book, OrderStatus, Prisma } from '@prisma/client';

export declare type CreateUser = {
  //   id: bigint;
  firstName: string;
  lastName: string;
  userName: string;
  mobileNumber: string;
  emailId: string;
  password: string;
  salt: string;
  address: string;
  city: string | null;
  street: string | null;
  //   isSuspended: boolean;
  //   lastLoginAt: Date | null;
  //   lastLogoutAt: Date | null;
  //   createdAt: Date;
  //   updatedAt: Date | null;
  //   deletedAt: Date | null;
};

export declare type GetUser = {
  id: bigint;
  firstName: string;
  lastName: string;
  userName: string;
  mobileNumber: string;
  emailId: string;
  address: string;
  city: string | null;
  street: string | null;
  isSuspended: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type AddToCart = {
  id: bigint;
  userId: bigint;
  bookId: bigint;
  quantity: number;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type GetCartByUserId = {
  id: bigint;
  userId: bigint;
  bookId: bigint;
  quantity: number;
  createdAt: Date;
  updatedAt: Date | null;
  Book: Book;
};

export declare type NewOrder = {
  // id: bigint
  userId: bigint;
  deliveryAddress: string;
  totalAmount: Prisma.Decimal;
  // createdAt: Date;
  // updatedAt: Date | null;
};

export declare type GetOrder = {
  id: bigint;
  userId: bigint;
  status: OrderStatus;
  deliveryAddress: string;
  totalAmount: Prisma.Decimal;
  createdAt: Date;
  updatedAt: Date | null;
};

export declare type NewOrderDetail = {
  // id: bigint
  orderId: bigint;
  bookId: bigint;
  quantity: number;
  price: Prisma.Decimal;
  // createdAt: Date
  // updatedAt: Date | null
}[];
