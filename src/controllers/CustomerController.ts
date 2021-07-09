import * as express from 'express';
import BaseController from './BaseController';
import { inject, injectable } from 'inversify';
import { ILoggerService } from '../interfaces/ILoggerService';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { TYPES } from '../config/types';
import { BadRequest } from '../errors/BadRequest';
import { ICustomerService } from '../interfaces/ICUstomerService';

@injectable()
export default class CustomerController extends BaseController {
  private _loggerService: ILoggerService;

  private _customerService: ICustomerService;

  constructor(
    loggerService: ILoggerService,
    customerService: ICustomerService,
  ) {
    super();
    this._loggerService = loggerService;
    this._customerService = customerService;
    this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
  }
}
