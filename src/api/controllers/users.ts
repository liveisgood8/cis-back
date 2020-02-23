import { Route, Get, Controller } from 'tsoa';
import { User } from '../../models/user';
import Container from 'typedi';
import { UsersService } from '../../services/users';

@Route('/users')
export class UsersController extends Controller {
  @Get('/all')
  public async getAll(): Promise<User[]> {
    const userService = Container.get(UsersService);
    return userService.getAll();
  }
}
