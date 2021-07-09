import { ILoggerService } from '../interfaces/ILoggerService';
import { IRoleService } from '../interfaces/IRoleService';
import BaseController from './BaseController';
import { inject, injectable } from 'inversify';
import * as express from 'express';

@injectable()
export default class RoleController extends BaseController {
  private _loggerService: ILoggerService;

  private _roleService: IRoleService;

  constructor(loggerService: ILoggerService, roleService: IRoleService) {
    super();
    this._loggerService = loggerService;
    this._roleService = roleService;
    this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
  }

  async getUserRole(req: express.Request, res: express.Response) {
    try {
      // TODO: validate parameters

      const userId = BigInt(req.params.id);

      const role = await this._roleService.getUserRole(userId);

      // Return response
      return this.sendJSONResponse(
        res,
        'User Role',
        {
          length: 1,
        },
        role,
      );
    } catch (error) {
      console.log(error);

      return this.sendErrorResponse(req, res, error);
    }
  }
}
