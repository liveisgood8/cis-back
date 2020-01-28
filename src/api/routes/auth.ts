import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import Container from 'typedi';
import { UserService } from '../../services/user';
import { sign } from 'jsonwebtoken';
import config from '../../config';

export default (router: Router): void => {
  router.post('/auth/signin', [
    check('login').isString().withMessage('Поле login должно быть строкой'),
    check('password').isString().withMessage('Поле password должно быть строкой'),
  ], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        error: errors,
      }).status(422);
    }

    const userService = Container.get(UserService);
    const signInStatus = await userService.signIn(req.body.login, req.body.password);
    if (signInStatus.error) {
      return res.json({
        error: signInStatus.error,
      }).status(422);
    }

    const jwtPayload = {
      user: signInStatus.user,
    };
    const token = sign(jwtPayload, config.jwt.secretKey, {
      audience: config.jwt.audience,
      expiresIn: config.jwt.duration,
    });
    res.json({
      user: signInStatus.user,
      token: token,
    });
  });
};
