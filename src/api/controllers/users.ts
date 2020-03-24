import { Route, Get, Controller, Tags, Patch, Body, Security, Request } from 'tsoa';
import Container from 'typedi';
import { User } from '../../models/user';
import { UsersService } from '../../services/users';
import { CodeError } from '../../utils/error-with-code';
import { Errors } from '../../utils/errors';

interface IUserUpdateBody {
  id: number;
  password?: string;
  name: string;
  surname: string;
  imageUrl: string;
}

@Tags('Users')
@Route('/users')
export class UsersController extends Controller {
  @Get()
  public async getAll(): Promise<User[]> {
    const userService = Container.get(UsersService);
    return userService.getAll();
  }

  @Patch()
  @Security('JWT')
  public async update(@Request() req: Express.Request, @Body() user: IUserUpdateBody): Promise<void> {
    const userService = Container.get(UsersService);
    try {
      console.log(req.user, user);
      if ((req.user as User).id === user.id) {
        await userService.update(user);
      }
    } catch (err) {
      throw new CodeError(Errors.UPDATE_ENTITY_ERROR,
          406,
          err.message);
    }
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
