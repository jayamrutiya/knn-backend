import { Login } from '../types/Authentication';

export interface IAuthenticationService {
  doLogin(userName: string, password: string): Promise<Login>;

  refreshToken(userId: bigint, refreshToken: string): Promise<string>;
}
