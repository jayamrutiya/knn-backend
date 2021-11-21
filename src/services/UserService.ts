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
  UpdateUser,
} from '../types/User';
import crypto from 'crypto';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { User, OrderStatus } from '@prisma/client';
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

    const cartdata = await this._userRepository.getCartByUserIdAndBookId(
      userId,
      bookId,
    );

    if (cartdata) {
      throw new BadRequest('Book alredy in cart.');
    }

    const cart = await this._userRepository.addToCart(userId, bookId, quantity);

    return cart;
  }

  async generateOrder(
    userId: bigint,
    firstName: string | null,
    lastName: string | null,
    emailId: string | null,
    mobileNumber: string | null,
    deliveryAddress: string | null,
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

    let totalPrice: number = 0.0;

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].Book.stock <= 0) {
        throw new BadRequest(`${cart[i].Book.bookName} is out of stock.`);
      }
      totalPrice = Number(totalPrice) + Number(cart[i].Book.price);
    }

    const newOrderPayload: NewOrder = {
      userId,
      firstName,
      lastName,
      emailId,
      mobileNumber,
      deliveryAddress,
      totalAmount: new Decimal(totalPrice),
    };

    let lastOrderId;
    const lastOrder = await this._userRepository.getUserLastSuccessOrder(
      userId,
    );

    if (
      lastOrder !== null &&
      (lastOrder.status === OrderStatus['PENDING'] ||
        lastOrder.status === OrderStatus['ONTHEWAY'])
    ) {
      throw new BadRequest(
        `Your last order status is ${lastOrder.status}. So you can't place new order.`,
      );
    }

    const order = await this._userRepository.createOrder(newOrderPayload);

    if (lastOrder !== null && lastOrder.status === OrderStatus['DELIVERED']) {
      lastOrderId = lastOrder.id;
    } else {
      lastOrderId = order.id;
    }

    await this._userRepository.createBookExchangeLog(
      userId,
      lastOrderId,
      order.id,
    );

    // await this._userRepository.createUserCurrentBook(order.id, userId);

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

  async verifyUser(userId: bigint, isVerify: boolean): Promise<boolean> {
    const user = await this._userRepository.getUser(userId);
    if (user.isSubscriptionComplete === false) {
      throw new BadRequest('User Not complete subscription process');
    }
    if (isVerify) {
      const userRole = await this._roleRepository.getUserRole(userId);
      const getRoleId = await this._roleRepository.getRoleByName('Member');

      const userBook = await this._bookRepository.getBookByCreateBy(userId);

      console.log('userBook', userBook);

      if (userBook) {
        for (let i = 0; i < userBook.length; i++) {
          if (userBook[i].Book.isActivated === false) {
            throw new BadRequest(
              'User Book not verify yet. First do verify book that upload by user.',
            );
          }
        }
      }

      await this._roleRepository.updateUserRoler(getRoleId.id, userRole.id);

      // TODO: Send confirmation email
    } else {
      await this._userRepository.changeSubscriptionStatus(userId, false);

      if (user.UserSubscription[0].type === 'BOOK') {
        const userBook = await this._bookRepository.getBookByCreateBy(userId);

        if (userBook) {
          for (let i = 0; i < userBook.length; i++) {
            await this._bookRepository.deleteBook(userBook[i].Book.id);
          }
        }
      }

      await this._userRepository.deleteUserSubscription(
        user.UserSubscription[0].id,
      );

      // TODO: Send cancletion email
    }
    return this._userRepository.verifyUser(userId, isVerify);
  }

  async getUser(userId: bigint): Promise<any> {
    return this._userRepository.getUser(userId);
  }

  async getCartByUserId(userId: bigint): Promise<any> {
    const cart = await this._userRepository.getCartByUserId(userId);
    return cart;
  }

  async getCartById(cartId: bigint): Promise<any> {
    return this._userRepository.getCartById(cartId);
  }

  async deleteCartItem(cartId: bigint): Promise<boolean> {
    const cart = await this._userRepository.getCartById(cartId);
    if (cart === null) {
      throw new NotFound('Cat item not found');
    }

    return this._userRepository.deleteCartItem(cartId);
  }

  async getUserWithCount(userId: bigint): Promise<any> {
    const user = await this._userRepository.getUserWithCount(userId);
    if (user === null) {
      throw new NotFound('User not found');
    }
    const data = {
      id: user.id,
      profilePicture: user.profilePicture,
      firstName: user.firstName,
      emailId: user.emailId,
      mobileNumber: user.mobileNumber,
      address: user.address,
      bookExchanged: user.UserBookExchangeLogs.length,
      eventParticipated: user.EventRegistration.length,
      discussions: user.Discussion.length,
    };

    return data;
  }

  async updateUser(updateUser: UpdateUser): Promise<any> {
    const user = await this._userRepository.getUserWithCount(updateUser.id);
    if (user === null) {
      throw new NotFound('User not found');
    }
    if (updateUser.profilePicture === null) {
      updateUser.profilePicture = user.profilePicture;
    }

    return this._userRepository.updateUser(updateUser);
  }

  async newusers(isVerify: boolean): Promise<any> {
    return this._userRepository.newusers(isVerify);
  }

  async getOrder(status: OrderStatus): Promise<boolean> {
    return this._userRepository.getOrder(status);
  }

  async orderStatusChange(id: bigint, status: OrderStatus): Promise<boolean> {
    console.log('status', status);

    let order = await this._userRepository.getOrderById(id);

    if (order === null) {
      throw new BadRequest('Order not found');
    }

    if (
      order.User.UserBookExchangeLogs[0].previousOrderId ===
      order.User.UserBookExchangeLogs[0].latestOrderId
    ) {
      const getUserBook = await this._bookRepository.getBookByCreateBy(
        order.userId,
      );

      order.GetBackFromUser = await getUserBook.map((data: any) => data.Book);
      delete order.User.UserBookExchangeLogs;
    } else {
      order.GetBackFromUser = await order.User.UserBookExchangeLogs[0]
        .PreviousOrder.OrderDetail;
      delete order.User.UserBookExchangeLogs;
    }

    if (status === OrderStatus['DELIVERED']) {
      // TODO : send email
      // TODO : change the stock of book that get back from user
      for (let i = 0; i < order.GetBackFromUser.length; i++) {
        await this._bookRepository.updateBookStock(
          order.GetBackFromUser[i].id,
          true,
        );
      }
    }
    if (status === OrderStatus['CANCLE']) {
      // TODO : send email
      // TODO : change the stock of book that user ordered
      for (let i = 0; i < order.OrderDetail.length; i++) {
        await this._bookRepository.updateBookStock(
          order.OrderDetail[i].Book.id,
          true,
        );
      }
    }
    if (status === OrderStatus['ONTHEWAY']) {
      // TODO : send email
    }
    return this._userRepository.orderStatusChange(id, status);
  }

  async getOrderById(id: bigint): Promise<any> {
    let order = await this._userRepository.getOrderById(id);

    console.log('order', order);

    if (
      order.User.UserBookExchangeLogs[0].previousOrderId ===
      order.User.UserBookExchangeLogs[0].latestOrderId
    ) {
      const getUserBook = await this._bookRepository.getBookByCreateBy(
        order.userId,
      );

      order.GetBackFromUser = await getUserBook.map((data: any) => data.Book);
      delete order.User.UserBookExchangeLogs;
    } else {
      order.GetBackFromUser = await order.User.UserBookExchangeLogs[0]
        .PreviousOrder.OrderDetail;
      delete order.User.UserBookExchangeLogs;
    }

    return order;
  }
}
