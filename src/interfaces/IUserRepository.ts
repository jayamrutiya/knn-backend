import { ForgotPassword, User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { RefreshToken } from '../types/Authentication';
import {
  AddToCart,
  CreateUser,
  GetCartByUserId,
  GetOrder,
  GetUser,
  NewOrder,
  NewOrderDetail,
} from '../types/User';

export interface IUserRepository {
  createUser(newUser: CreateUser): Promise<GetUser>;

  getUserByUserName(userName: string): Promise<User | null>;

  getUserByEmailId(emailId: string): Promise<User | null>;

  setLastLogin(userId: bigint): Promise<boolean>;

  storeRefreshToken(userId: bigint, token: string): Promise<boolean>;

  saveForgotPassword(
    userId: bigint,
    emailId: string,
    nonce: string,
  ): Promise<void>;

  getForgotPassword(userId: bigint): Promise<ForgotPassword | null>;

  updatePassword(userId: bigint, password: string): Promise<void>;

  getRereshToken(userId: bigint, refreshToken: string): Promise<RefreshToken>;

  getUserById(userId: bigint): Promise<User | null>;

  getCartByUserId(userId: bigint): Promise<GetCartByUserId[]>;

  addToCart(
    userId: bigint,
    bookId: bigint,
    quantity: number,
  ): Promise<AddToCart>;

  createOrder(newOrder: NewOrder): Promise<GetOrder>;

  createOrderDetail(newOrderDetail: NewOrderDetail): Promise<boolean>;

  deleteCartByUserId(userId: bigint): Promise<boolean>;

  getUserSubscription(userId: bigint): Promise<any>;

  getUserSubscriptionUsage(userSubscriptionId: bigint): Promise<any>;

  updateUserSubscriptionUsage(
    userSubscriptionUsageId: bigint,
    noOfBookUploaded: number,
    priceDeposited: Decimal,
  ): Promise<boolean>;

  verifyUser(userId: bigint, isVerify: boolean): Promise<boolean>;

  doneSubscriptionProcess(userId: bigint, isDone: boolean): Promise<boolean>;

  getUser(userId: bigint): Promise<any>;

  createUserBook(userId: bigint, bookId: bigint): Promise<any>;
}
