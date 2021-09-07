import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IUserService } from '../interfaces/IUserService';
import {
  AddToCart,
  CreateUser,
  GetOrder,
  GetUser,
  NewOrder,
  NewOrderDetail,
} from '../types/User';
import crypto from 'crypto';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { User } from '@prisma/client';
import { NotFound } from '../errors/NotFound';
import { IBookRepository } from '../interfaces/IBookRepository';
import { BadRequest } from '../errors/BadRequest';
import { Decimal } from '@prisma/client/runtime';

@injectable()
export class UserService implements IUserService {
  private _loggerService: ILoggerService;

  private _userRepository: IUserRepository;

  private _roleRepository: IRoleRepository;

  private _bookRepository: IBookRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.RoleRepository) roleRepository: IRoleRepository,
    @inject(TYPES.BookRepository) bookRepository: IBookRepository,
  ) {
    this._loggerService = loggerService;
    this._userRepository = userRepository;
    this._roleRepository = roleRepository;
    this._bookRepository = bookRepository;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async createUser(newUser: CreateUser): Promise<GetUser> {
    // Create hash of the password
    newUser.salt = crypto.randomBytes(16).toString('hex');
    newUser.password = crypto
      .pbkdf2Sync(newUser.password, newUser.salt, 1000, 64, 'sha512')
      .toString('hex');

    const user = await this._userRepository.createUser(newUser);

    const role = await this._roleRepository.getRoleByName('User');

    await this._roleRepository.assignRoleToUser(role.id, user.id);

    return user;
  }

  async getUserByUserName(userName: string): Promise<User | null> {
    return this._userRepository.getUserByUserName(userName);
  }

  async addToCart(
    userId: bigint,
    bookId: bigint,
    quantity: number,
  ): Promise<AddToCart> {
    const user = await this._userRepository.getUserById(userId);
    if (user === null) {
      throw new NotFound(`User not found with userId ${userId}`);
    }

    const book = await this._bookRepository.getBookById(bookId);

    const cart = await this._userRepository.addToCart(userId, bookId, quantity);

    return cart;
  }

  async generateOrder(
    userId: bigint,
    deliveryAddress: string,
    totalAmount: Decimal,
  ): Promise<GetOrder> {
    const user = await this._userRepository.getUserById(userId);
    if (user === null) {
      throw new NotFound(`User not found with userId ${userId}`);
    }

    const userRole = await this._roleRepository.getUserRole(userId);

    if (userRole.Role !== 'Member') {
      throw new BadRequest('User not purchase any subscription plan');
    }

    const cart = await this._userRepository.getCartByUserId(userId);

    if (cart.length === 0) {
      throw new BadRequest('Your cart is empty.');
    }

    if (cart.length !== 2) {
      throw new BadRequest('Must buy 2 item per order.');
    }

    const newOrderPayload: NewOrder = {
      userId,
      deliveryAddress,
      totalAmount,
    };

    const order = await this._userRepository.createOrder(newOrderPayload);

    const newOrderDetailPayload: NewOrderDetail = cart.map((cartItem) => {
      return {
        orderId: order.id,
        bookId: cartItem.bookId,
        quantity: cartItem.quantity,
        price: cartItem.Book.price,
      };
    });

    const orderDetail = await this._userRepository.createOrderDetail(
      newOrderDetailPayload,
    );

    await this._userRepository.deleteCartByUserId(userId);

    cart.map(
      async (item) =>
        await this._bookRepository.updateBookStock(item.bookId, false),
    );

    return order;
  }
}
