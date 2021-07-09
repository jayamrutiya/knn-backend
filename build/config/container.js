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
const iocContainer = new inversify_1.Container();
exports.iocContainer = iocContainer;
// make inversify aware of inversify-binding-decorators
iocContainer.load(inversify_binding_decorators_1.buildProviderModule());
// Services
iocContainer.bind(types_1.TYPES.LoggerService).to(logger_1.LoggerService);
iocContainer.bind(types_1.TYPES.DatabaseService).to(db_1.DatabaseService);
iocContainer.bind(types_1.TYPES.CustomerService).to(CustomerService_1.CustomerService);
// iocContainer.bind<IRoleService>(TYPES.RoleService).to(RoleService);
// iocContainer.bind<IOrganisationService>(TYPES.OrganisationService).to(OrganisationService);
// iocContainer.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService);
// Repositories
iocContainer
    .bind(types_1.TYPES.CustomerRepository)
    .to(CustomerRepository_1.CustomerRepository);
