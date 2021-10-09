import { IAuthenticationService } from '../interfaces/IAuthenticationService';
import { IJwtService } from '../interfaces/IJwtService';
import { ILoggerService } from '../interfaces/ILoggerService';
import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types';
import { Login } from '../types/Authentication';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IRoleRepository } from '../interfaces/IRoleRepository';
import { BadRequest } from '../errors/BadRequest';
import crypto from 'crypto';
import ENV from '../config/env';
import { NotFound } from '../errors/NotFound';
import { GetUser } from '../types/User';
import app from '../config/express';
import { EventTypes } from '../config/events';

@injectable()
export class AuthenticationService implements IAuthenticationService {
  private _loggerService: ILoggerService;
  private _userRepository: IUserRepository;
  private _jwtService: IJwtService;
  private _roleRepository: IRoleRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.JwtService) jwtService: IJwtService,
    @inject(TYPES.RoleRepository) roleRepository: IRoleRepository,
  ) {
    this._loggerService = loggerService;
    this._userRepository = userRepository;
    this._jwtService = jwtService;
    this._roleRepository = roleRepository;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async doLogin(userName: string, password: string): Promise<Login> {
    const user = await this._userRepository.getUserByUserName(userName);
    console.log(user);

    if (user === null) {
      throw new NotFound(`User not found with userName ${userName}`);
    }

    if (user.isSuspended) {
      throw new BadRequest('User is suspended.');
    }

    const newHash = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
      .toString('hex');

    if (newHash !== user.password) {
      throw new BadRequest('Invalid username or password provided.');
    }

    await this._userRepository.setLastLogin(user.id);

    const userRole = await this._roleRepository.getUserRole(user.id);

    const accessToken = this._jwtService.generateToken(
      userRole,
      ENV.ACCESS_TOKEN_SECRET!,
      ENV.ACCESS_TOKEN_EXPIRES_IN!,
    );

    // Create a Refresh token
    const refreshToken = this._jwtService.generateToken(
      userRole,
      ENV.REFRESH_TOKEN_SECRET!,
      ENV.REFRESH_TOKEN_EXPIRES_IN!,
    );

    await this._userRepository.storeRefreshToken(user.id, refreshToken);

    // Return token
    return { accessToken, refreshToken };
  }

  async refreshToken(userId: bigint, refreshToken: string): Promise<string> {
    const token = await this._userRepository.getRereshToken(
      userId,
      refreshToken,
    );

    if (!token) {
      throw new BadRequest('Invalid refresh token provided.');
    }

    const userRole = await this._roleRepository.getUserRole(userId);

    const user: GetUser = (await this._jwtService.verifyToken(
      refreshToken,
      ENV.REFRESH_TOKEN_SECRET!,
    )) as GetUser;

    console.log(typeof user.id, typeof userId);

    if (user.id !== userId) {
      throw new BadRequest('Invalid user found.');
    }

    // Create a JWT token
    const accessToken = this._jwtService.generateToken(
      userRole,
      ENV.ACCESS_TOKEN_SECRET!,
      ENV.ACCESS_TOKEN_EXPIRES_IN!,
    );

    return accessToken;
  }

  async forgotPassword(emailId: string): Promise<boolean> {
    // Get user with the given email address
    const user = await this._userRepository.getUserByEmailId(emailId);

    // If no user is present, throw error
    if (!user) {
      throw new NotFound('No user found with given email address.');
    }

    // Create a new nonce to reset the password
    const nonce = crypto.randomBytes(64).toString('hex');
    console.log('nonce', nonce);

    const hashedNonce = crypto
      .pbkdf2Sync(nonce, user.salt, 1000, 64, 'sha512')
      .toString('hex');
    // Emit event to send email
    app.emit(EventTypes.SEND_RESET_PASSWORD_EMAIL, {
      userId: user.id,
      emailId,
      nonce,
    });

    // Store the forgot password request
    await this._userRepository.saveForgotPassword(
      user.id,
      emailId,
      hashedNonce,
    );

    return true;
  }

  async resetPassword(
    userId: bigint,
    password: string,
    nonce: string,
  ): Promise<boolean> {
    console.log(userId, password, nonce);

    // Get user with the given email address
    const user = await this._userRepository.getUserById(userId);

    // If no user is present, throw error
    if (!user) {
      throw new NotFound('No user found with given email address.');
    }

    // Get forgot password request
    const forgotPassword = await this._userRepository.getForgotPassword(userId);

    if (!forgotPassword) {
      throw new BadRequest(
        'Cannot find request to reset password for the given user.',
      );
    }

    // Check if the nonce is valid
    const hashedNonce = crypto
      .pbkdf2Sync(nonce, user.salt, 1000, 64, 'sha512')
      .toString('hex');

    console.log('kjljjk', hashedNonce, '&', forgotPassword.nonce);
    if (hashedNonce !== forgotPassword.nonce) {
      throw new BadRequest('Invalid request to reset password');
    }

    // Save the new password
    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
      .toString('hex');
    this._userRepository.updatePassword(userId, hashedPassword);

    return true;
  }
}
