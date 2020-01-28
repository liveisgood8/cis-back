import { Router, Request, Response } from 'express';
import jwtAuth from '../middlewares/jwt-auth';
import Container from 'typedi';
import { UserService } from '../../services/user';

export default (router: Router): void => {
  router.get('/user/all', jwtAuth, async (req: Request, res: Response) => {
    const userService = Container.get(UserService);
    const users = await userService.getAll();
    res.json(users);
  });
};
