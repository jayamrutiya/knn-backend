import express from 'express';
import CustomerController from '../controllers/CustomerController';
import { TYPES } from '../config/types';
import { iocContainer as Container } from '../config/container';
import { ILoggerService } from '../interfaces/ILoggerService';
import { ICustomerService } from '../interfaces/ICustomerService';
const router = express.Router();

// Get service instance and create a new User controller
const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
const customerService = Container.get<ICustomerService>(TYPES.CustomerService);
const customerController = new CustomerController(
  loggerService,
  customerService,
);

export default router;
