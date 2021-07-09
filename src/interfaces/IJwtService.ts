import { UserToken } from '../types/Authentication';

export interface IJwtService {
  generateToken(data: UserToken, secret: string, expiresIn: string): string;

  verifyToken(token: string, secret: string): string | object;
}
