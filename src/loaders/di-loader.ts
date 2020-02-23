import Container from 'typedi';
import { getRepository } from 'typeorm';
import { AuthService } from '../services/auth';
import { User } from '../models/user';
import { UsersService } from '../services/users';

export default (): void => {
  Container.set(AuthService, new AuthService(getRepository(User)));
  Container.set(UsersService, new UsersService(getRepository(User)));
};
