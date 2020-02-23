import passport = require('passport');
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Container } from 'typedi';
import config from '../config';
import { User } from '../models/user';
import { UsersService } from '../services/users';

export default (): void => {
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secretKey,
    audience: config.jwt.audience,
  }, async (payload: any, done: (error: Error, user?: any, options?: any) => void) => {
    const payloadUser: User = payload.user;
    const userService = Container.get(UsersService);

    const user = await userService.getById(payloadUser.id);
    if (user &&
        user.login === payloadUser.login &&
        user.name === payloadUser.name) {
      delete user.password;
      return done(null, user);
    } else {
      const err = new Error('Невалидный токен');
      return done(err, null);
    }
  }));
};
