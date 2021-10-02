import { User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { AddToCart, CreateUser, GetOrder, GetUser } from '../types/User';

export interface IUserService {
  createUser(newUser: CreateUser): Promise<GetUser>;

  getUserByUserName(userName: string): Promise<User | null>;

  addToCart(
    userId: bigint,
    bookId: bigint,
    quantity: number,
  ): Promise<AddToCart>;

  generateOrder(
    userId: bigint,
    deliveryAddress: string,
    totalAmount: Decimal,
  ): Promise<GetOrder>;

  verifyUser(userId: bigint, isVerify: boolean): Promise<boolean>;

  getUser(userId: bigint): Promise<any>;
}
