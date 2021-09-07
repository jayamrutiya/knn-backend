import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';

import { TYPES } from './types';
import { LoggerService } from './logger';
import { DatabaseService } from './db';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { CustomerService } from '../services/CustomerService';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { ICustomerService } from '../interfaces/ICustomerService';
import { ICustomerRepository } from '../interfaces/ICustomerRepository';
import { IUserService } from '../interfaces/IUserService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IRoleService } from '../interfaces/IRoleService';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { RoleService } from '../services/RoleService';
import { IAuthenticationService } from '../interfaces/IAuthenticationService';
import { AuthenticationService } from '../services/AuthenticationService';
import { JwtService } from '../services/JwtService';
import { IJwtService } from '../interfaces/IJwtService';
import { ISubscriptionRepository } from '../interfaces/ISubscriptionRepository';
import { SubscriptionRepository } from '../repositories/SubscriptionRepository';
import { ISubscriptionService } from '../interfaces/ISubscriptionService';
import { SubscriptionService } from '../services/SubscriptionService';
import { BookService } from '../services/BookService';
import { IBookService } from '../interfaces/IBookService';
import { BookRepository } from '../repositories/BookRepository';
import { IBookRepository } from '../interfaces/IBookRepository';
import { IEventService } from '../interfaces/IEventService';
import { EventService } from '../services/EventService';
import { IEventRepository } from '../interfaces/IEventRepository';
import { EventRepository } from '../repositories/EventRepository';
import { IBlogService } from '../interfaces/IBlogService';
import { BlogService } from '../services/BlogService';
import { IBlogRepository } from '../interfaces/IBlogRepository';
import { BlogRepository } from '../repositories/BlogRepository';
import { IDiscussionService } from '../interfaces/IDiscussionService';
import { DiscussionService } from '../services/DiscussionService';
import { IDiscussionRepository } from '../interfaces/IDiscussionRepository';
import { DiscussionRepository } from '../repositories/DiscussionRepository';
import { ICategoryService } from '../interfaces/ICategoryService';
import { CategoryService } from '../services/CategoryService';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';
import { CategoryRepository } from '../repositories/CategoryRepository';

const iocContainer = new Container();

// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());

// Services
iocContainer.bind<ILoggerService>(TYPES.LoggerService).to(LoggerService);
iocContainer.bind<IDatabaseService>(TYPES.DatabaseService).to(DatabaseService);

iocContainer.bind<ICustomerService>(TYPES.CustomerService).to(CustomerService);
iocContainer
  .bind<IAuthenticationService>(TYPES.AuthenticationService)
  .to(AuthenticationService);
iocContainer.bind<IJwtService>(TYPES.JwtService).to(JwtService);
iocContainer.bind<IUserService>(TYPES.UserService).to(UserService);
iocContainer.bind<IRoleService>(TYPES.RoleService).to(RoleService);
iocContainer
  .bind<ISubscriptionService>(TYPES.SubscriptionService)
  .to(SubscriptionService);
iocContainer.bind<IBookService>(TYPES.BookService).to(BookService);
iocContainer.bind<IEventService>(TYPES.EventService).to(EventService);
iocContainer.bind<IBlogService>(TYPES.BlogService).to(BlogService);
iocContainer
  .bind<IDiscussionService>(TYPES.DiscussionService)
  .to(DiscussionService);
iocContainer.bind<ICategoryService>(TYPES.CategoryService).to(CategoryService);
// iocContainer.bind<IRoleService>(TYPES.RoleService).to(RoleService);
// iocContainer.bind<IOrganisationService>(TYPES.OrganisationService).to(OrganisationService);

// iocContainer.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService);

// Repositories
iocContainer
  .bind<ICustomerRepository>(TYPES.CustomerRepository)
  .to(CustomerRepository);
iocContainer.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
iocContainer.bind<IRoleRepository>(TYPES.RoleRepository).to(RoleRepository);
iocContainer
  .bind<ISubscriptionRepository>(TYPES.SubscriptionRepository)
  .to(SubscriptionRepository);
iocContainer.bind<IBookRepository>(TYPES.BookRepository).to(BookRepository);
iocContainer.bind<IEventRepository>(TYPES.EventRepository).to(EventRepository);
iocContainer.bind<IBlogRepository>(TYPES.BlogRepository).to(BlogRepository);
iocContainer
  .bind<IDiscussionRepository>(TYPES.DiscussionRepository)
  .to(DiscussionRepository);
iocContainer
  .bind<ICategoryRepository>(TYPES.CategoryRepository)
  .to(CategoryRepository);
// iocContainer.bind<IRoleRepository>(TYPES.RoleRepository).to(RoleRepository);
// iocContainer.bind<IOrganisationRepository>(TYPES.OrganisationRepository).to(OrganisationRepository);

// iocContainer.bind<IPaymentRepository>(TYPES.PaymentRepository).to(PaymentRepository);

export { iocContainer };
