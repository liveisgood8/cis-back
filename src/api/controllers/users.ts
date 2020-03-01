import { Route, Get, Controller, Tags } from 'tsoa';
import Container from 'typedi';
import { User } from '../../models/user';
import { UsersService } from '../../services/users';

@Tags('Users')
@Route('/users')
export class UsersController extends Controller {
  @Get()
  public async getAll(): Promise<User[]> {
    const userService = Container.get(UsersService);
    return userService.getAll();
  }
}
