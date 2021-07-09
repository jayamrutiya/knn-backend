import { inject, injectable } from 'inversify';

import { IDatabaseService } from '../interfaces/IDatabaseService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { TYPES } from '../config/types';

import { ICustomerRepository } from '../interfaces/ICustomerRepository';
import { InternalServerError } from '../errors/InternalServerError';
import { NotFound } from '../errors/NotFound';

@injectable()
export class CustomerRepository implements ICustomerRepository {
  private _loggerService: ILoggerService;

  private _databaseService: IDatabaseService;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.DatabaseService) databaseService: IDatabaseService,
  ) {
    this._loggerService = loggerService;
    this._databaseService = databaseService;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }
}
