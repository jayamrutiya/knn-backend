import { Login } from '../types/Authentication';

export interface IAuthenticationService {
  doLogin(userName: string, password: string): Promise<Login>;

  refreshToken(userId: bigint, refreshToken: string): Promise<string>;

  forgotPassword(emailId: string): Promise<boolean>;

  resetPassword(
    userId: bigint,
    password: string,
    nonce: string,
  ): Promise<boolean>;
}
