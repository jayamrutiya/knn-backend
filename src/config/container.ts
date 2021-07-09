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
import IBookRepository from '../interfaces/IBookRepository';

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
// iocContainer.bind<IRoleRepository>(TYPES.RoleRepository).to(RoleRepository);
// iocContainer.bind<IOrganisationRepository>(TYPES.OrganisationRepository).to(OrganisationRepository);

// iocContainer.bind<IPaymentRepository>(TYPES.PaymentRepository).to(PaymentRepository);

export { iocContainer };
