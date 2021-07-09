import { IAuthenticationService } from '../interfaces/IAuthenticationService';
import { ILoggerService } from '../interfaces/ILoggerService';
import BaseController from './BaseController';
import { inject, injectable } from 'inversify';
import * as express from 'express';
import { BadRequest } from '../errors/BadRequest';

@injectable()
export default class AuthenticationController extends BaseController {
  private _loggerService: ILoggerService;

  private _authenticationService: IAuthenticationService;

  constructor(
    loggerService: ILoggerService,
    authenticationService: IAuthenticationService,
  ) {
    super();
    this._loggerService = loggerService;
    this._authenticationService = authenticationService;
    this._loggerService.getLogger().info(`Creating : ${this.constructor.name}`);
  }

  async doLogin(req: express.Request, res: express.Response) {
    try {
      console.log('in auth controller');
      // validate input
      this.validateRequest(req);

      // Get parameters
      const { userName, password } = req.body;

      // verify login
      const verifiedLogin = await this._authenticationService.doLogin(
        userName,
        password,
      );

      // send response
      this.sendJSONResponse(
        res,
        'Logged in successfully!',
        { size: 1 },
        verifiedLogin,
      );
    } catch (error) {
      this.sendErrorResponse(req, res, error);
    }
  }

  async refreshToken(req: express.Request, res: express.Response) {
    try {
      // validate request
      this.validateRequest(req);

      // Get the parameters
      const { userId, refreshToken } = req.body;

      // New token
      const token = await this._authenticationService.refreshToken(
        BigInt(userId),
        refreshToken,
      );

      // Send the response
      this.sendJSONResponse(res, null, { size: 1 }, { token });
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new BadRequest('Invalid request parameters found.');
      }
      this.sendErrorResponse(req, res, error);
    }
  }
}
