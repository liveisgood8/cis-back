import { Request, Response, NextFunction } from 'express';
import { authenticate } from 'passport';
import { User } from '../../models/user';

export default (req: Request, res: Response, next: NextFunction): void => {
  authenticate('jwt', {
    session: false,
  }, (err: Error, user: User, info: any) => {
    if (err || !user) {
      if (err) {
        return next(err);
      } else {
        const error = new Error(
          typeof info.message !== 'undefined' ?
            info.message : 'Непредвиденная ошибка при проверке токена');
        return next(error);
      }
    } else {
      return next();
    }
  })(req, res, next);
};
