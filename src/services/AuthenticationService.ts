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

@injectable()
export class AuthenticationService implements IAuthenticationService {
  private _loggerService: ILoggerService;
  private _jwtService: IJwtService;
  private _userRepository: IUserRepository;
  private _roleRepository: IRoleRepository;

  constructor(
    @inject(TYPES.LoggerService) loggerService: ILoggerService,
    @inject(TYPES.JwtService) jwtService: IJwtService,
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.RoleRepository) roleRepository: IRoleRepository,
  ) {
    this._loggerService = loggerService;
    this._jwtService = jwtService;
    this._userRepository = userRepository;
    this._roleRepository = roleRepository;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async doLogin(userName: string, password: string): Promise<Login> {
    const user = await this._userRepository.getUserByUserName(userName);

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
}
