import { Route, Get, Controller, Tags } from 'tsoa';
import Container from 'typedi';
import { User } from '../../models/user';
import { UsersService } from '../../services/users';
import { CodeError } from '../../utils/error-with-code';
import { Errors } from '../../utils/errors';

@Tags('Users')
@Route('/users')
export class UsersController extends Controller {
  @Get()
  public async getAll(): Promise<User[]> {
    const userService = Container.get(UsersService);
    return userService.getAll();
  }

  @Get('/profile-images')
  public async getProfileImages(): Promise<string[]> {
    const userService = Container.get(UsersService);
    try {
      return await userService.getProfileImages();
    } catch (err) {
      throw new CodeError(Errors.SERVICE_ERROR,
          406,
          err.message);
    }
  }
}
