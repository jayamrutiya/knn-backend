import { injectable } from 'inversify';
import { IJwtService } from '../interfaces/IJwtService';
import JSONBig from 'json-bigint';
import jwt from 'jsonwebtoken';
import { UserToken } from '../types/Authentication';

@injectable()
export class JwtService implements IJwtService {
  generateToken(data: UserToken, secret: string, expiresIn: string): string {
    const { id, ...withoutId } = data;
    return jwt.sign(
      {
        id: JSONBig.stringify(id),
        ...withoutId,
      },
      secret,
      {
        expiresIn,
      },
    );
  }

  verifyToken(token: string, secret: string): string | object {
    const payload = <UserToken>jwt.verify(token, secret);
    payload.id = BigInt(payload.id);
    return payload;
  }
}
