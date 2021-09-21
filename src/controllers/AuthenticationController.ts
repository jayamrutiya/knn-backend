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

  async forgotPassword(req: express.Request, res: express.Response) {
    try {
      // Get the parameters
      const { emailId } = req.body;

      // Call the forgot password service
      const result = await this._authenticationService.forgotPassword(emailId);

      // Send the response
      this.sendJSONResponse(
        res,
        result
          ? 'An email has been sent. Please follow the instructions in the email to reset the password.'
          : 'No user found with the given email address.',
        null,
        null,
      );
    } catch (error) {
      this.sendErrorResponse(req, res, error);
    }
  }

  async resetPassword(req: express.Request, res: express.Response) {
    try {
      console.log('in reset pass controller');

      // Get the parameters
      const userId =
        req.query.userId === undefined || req.query.userId === null
          ? 0n
          : BigInt(req.query.userId);
      const nonce =
        req.query.nonce === undefined ? '' : req.query.nonce.toString();
      const { password } = req.body;

      console.log(userId, password, nonce);

      await this._authenticationService.resetPassword(userId, password, nonce);

      this.sendJSONResponse(res, 'Password reset successfully!', null, null);
    } catch (error) {
      this.sendErrorResponse(req, res, error);
    }
  }
}
