import { User, OrderStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import {
  AddToCart,
  CreateUser,
  GetOrder,
  GetUser,
  UpdateUser,
} from '../types/User';

export interface IUserService {
  createUser(newUser: CreateUser): Promise<GetUser>;

  getUserByUserName(userName: string): Promise<User | null>;

  addToCart(
    userId: bigint,
    bookId: bigint,
    quantity: number,
  ): Promise<AddToCart>;

  getCartById(cartId: bigint): Promise<any>;

  deleteCartItem(cartId: bigint): Promise<boolean>;

  generateOrder(
    userId: bigint,
    firstName: string | null,
    lastName: string | null,
    emailId: string | null,
    mobileNumber: string | null,
    deliveryAddress: string,
    totalAmount: Decimal,
  ): Promise<GetOrder>;

  verifyUser(userId: bigint, isVerify: boolean): Promise<boolean>;

  getUser(userId: bigint): Promise<any>;

  getCartByUserId(userId: bigint): Promise<any>;

  getUserWithCount(userId: bigint): Promise<any>;

  updateUser(updateUser: UpdateUser): Promise<any>;

  newusers(isVerify: boolean): Promise<any>;

  getOrder(status: OrderStatus): Promise<boolean>;

  orderStatusChange(id: bigint, status: OrderStatus): Promise<boolean>;

  getOrderById(id: bigint): Promise<any>;
}
