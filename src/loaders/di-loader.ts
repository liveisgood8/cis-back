import Container from 'typedi';
import { getRepository } from 'typeorm';
import { UserService } from '../services/user';
import { User } from '../models/user';

export default (): void => {
  Container.set(UserService, new UserService(getRepository(User)));
};
