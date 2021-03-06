"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iocContainer = void 0;
const inversify_1 = require("inversify");
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const types_1 = require("./types");
const logger_1 = require("./logger");
const db_1 = require("./db");
const CustomerService_1 = require("../services/CustomerService");
const CustomerRepository_1 = require("../repositories/CustomerRepository");
const UserService_1 = require("../services/UserService");
const UserRepository_1 = require("../repositories/UserRepository");
const RoleRepository_1 = require("../repositories/RoleRepository");
const RoleService_1 = require("../services/RoleService");
const AuthenticationService_1 = require("../services/AuthenticationService");
const JwtService_1 = require("../services/JwtService");
const SubscriptionRepository_1 = require("../repositories/SubscriptionRepository");
const SubscriptionService_1 = require("../services/SubscriptionService");
const BookService_1 = require("../services/BookService");
const BookRepository_1 = require("../repositories/BookRepository");
const EventService_1 = require("../services/EventService");
const EventRepository_1 = require("../repositories/EventRepository");
const BlogService_1 = require("../services/BlogService");
const BlogRepository_1 = require("../repositories/BlogRepository");
const DiscussionService_1 = require("../services/DiscussionService");
const DiscussionRepository_1 = require("../repositories/DiscussionRepository");
const CategoryService_1 = require("../services/CategoryService");
const CategoryRepository_1 = require("../repositories/CategoryRepository");
const iocContainer = new inversify_1.Container();
exports.iocContainer = iocContainer;
// make inversify aware of inversify-binding-decorators
iocContainer.load(inversify_binding_decorators_1.buildProviderModule());
// Services
iocContainer.bind(types_1.TYPES.LoggerService).to(logger_1.LoggerService);
iocContainer.bind(types_1.TYPES.DatabaseService).to(db_1.DatabaseService);
iocContainer.bind(types_1.TYPES.CustomerService).to(CustomerService_1.CustomerService);
iocContainer
    .bind(types_1.TYPES.AuthenticationService)
    .to(AuthenticationService_1.AuthenticationService);
iocContainer.bind(types_1.TYPES.JwtService).to(JwtService_1.JwtService);
iocContainer.bind(types_1.TYPES.UserService).to(UserService_1.UserService);
iocContainer.bind(types_1.TYPES.RoleService).to(RoleService_1.RoleService);
iocContainer
    .bind(types_1.TYPES.SubscriptionService)
    .to(SubscriptionService_1.SubscriptionService);
iocContainer.bind(types_1.TYPES.BookService).to(BookService_1.BookService);
iocContainer.bind(types_1.TYPES.EventService).to(EventService_1.EventService);
iocContainer.bind(types_1.TYPES.BlogService).to(BlogService_1.BlogService);
iocContainer
    .bind(types_1.TYPES.DiscussionService)
    .to(DiscussionService_1.DiscussionService);
iocContainer.bind(types_1.TYPES.CategoryService).to(CategoryService_1.CategoryService);
// iocContainer.bind<IRoleService>(TYPES.RoleService).to(RoleService);
// iocContainer.bind<IOrganisationService>(TYPES.OrganisationService).to(OrganisationService);
// iocContainer.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService);
// Repositories
iocContainer
    .bind(types_1.TYPES.CustomerRepository)
    .to(CustomerRepository_1.CustomerRepository);
iocContainer.bind(types_1.TYPES.UserRepository).to(UserRepository_1.UserRepository);
iocContainer.bind(types_1.TYPES.RoleRepository).to(RoleRepository_1.RoleRepository);
iocContainer
    .bind(types_1.TYPES.SubscriptionRepository)
    .to(SubscriptionRepository_1.SubscriptionRepository);
iocContainer.bind(types_1.TYPES.BookRepository).to(BookRepository_1.BookRepository);
iocContainer.bind(types_1.TYPES.EventRepository).to(EventRepository_1.EventRepository);
iocContainer.bind(types_1.TYPES.BlogRepository).to(BlogRepository_1.BlogRepository);
iocContainer
    .bind(types_1.TYPES.DiscussionRepository)
    .to(DiscussionRepository_1.DiscussionRepository);
iocContainer
    .bind(types_1.TYPES.CategoryRepository)
    .to(CategoryRepository_1.CategoryRepository);
