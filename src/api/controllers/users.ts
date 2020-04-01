import { Route, Get, Controller, Tags, Patch, Body, Security, Request, Response } from 'tsoa';
import Container from 'typedi';
import { User } from '../../models/user';
import { UsersService } from '../../services/users';
import { CodeError } from '../../utils/error-with-code';
import { Errors } from '../../utils/errors';
import { IError } from '../../core/types';

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
  @Response<IError>('500', 'Ошибка получение информации о пользователях')
  @Get()
  public async getAll(): Promise<User[]> {
    const userService = Container.get(UsersService);
    return userService.getAll();
  }

  @Response<IError>('500', 'Ошибка обновлении информации о пользователях')
  @Patch()
  @Security('JWT')
  public async update(@Request() req: Express.Request, @Body() user: IUserUpdateBody): Promise<void> {
    const userService = Container.get(UsersService);
    try {
      if ((req.user as User).id === user.id) {
        await userService.update(user);
      }
    } catch (err) {
      throw new CodeError(Errors.UPDATE_ENTITY_ERROR,
        500,
        err.message);
    }
  }

  @Response<IError>('500', 'Ошибка получения списка изображений пользователей')
  @Get('/profile-images')
  public async getProfileImages(): Promise<string[]> {
    const userService = Container.get(UsersService);
    try {
      return await userService.getProfileImages();
    } catch (err) {
      throw new CodeError(Errors.SERVICE_ERROR,
        500,
        err.message);
    }
  }
}
