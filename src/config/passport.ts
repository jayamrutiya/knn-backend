/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';

import ENV from './env';
import { iocContainer as Container } from './container';
import { TYPES } from './types';
import { IDatabaseService } from '../interfaces/IDatabaseService';
import { UserToken } from '../types/Authentication';
import { Forbidden } from '../errors/Forbidden';

const databaseService = Container.get<IDatabaseService>(TYPES.DatabaseService);

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ENV.ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(options, async (payload: any, done) => {
    // Get database client
    const client = databaseService.Client();

    // Gets the user
    const user = await client.user.findFirst({
      where: {
        id: BigInt((<UserToken>payload).id),
      },
    });

    // If the user is not present
    if (!user) {
      throw new Forbidden('Invalid user token.');
    }

    return done(null, user);
  }),
);

export default passport;
