import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { ICustomerService } from '../interfaces/ICUstomerService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { ICustomerRepository } from '../interfaces/ICUstomerRepository';
@injectable()
export class CustomerService implements ICustomerService {
  private _loggerService: ILoggerService;

  private _customerRepository: ICustomerRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.CustomerRepository) customerRepository: ICustomerRepository,
  ) {
    this._loggerService = loggerService;
    this._customerRepository = customerRepository;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }
}
