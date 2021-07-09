"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = void 0;
exports.TYPES = {
    LoggerService: Symbol('ILoggerService'),
    DatabaseService: Symbol('IDatabaseService'),
    // Services
    CustomerService: Symbol('ICustomerService'),
    JwtService: Symbol('IJwtService'),
    AuthenticationService: Symbol('IAuthenticationService'),
    UserService: Symbol('IUserService'),
    RoleService: Symbol('IRoleService'),
    SubscriptionService: Symbol('ISubscriptionService'),
    BookService: Symbol('IBookService'),
    // RoleService: Symbol('IRoleService'),
    // PaymentService: Symbol('IPaymentService'),
    // OrganisationService: Symbol('IOrganisationService'),
    // Repositories
    CustomerRepository: Symbol('ICustomerRepository'),
    UserRepository: Symbol('IUserRepository'),
    RoleRepository: Symbol('IRoleRepository'),
    // RoleRepository: Symbol('IRoleRepository'),
    // OrganisationRepository: Symbol('IOrganisationRepository'),
    // PaymentRepository: Symbol('IPaymentRepository'),
    SubscriptionRepository: Symbol('ISubscriptionRepository'),
    BookRepository: Symbol('IBookRepository'),
};
