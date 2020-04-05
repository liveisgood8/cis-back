import { Controller, Post, Route, Response, Body, Tags } from 'tsoa';
import Container from 'typedi';
import { AuthService } from '../../services/auth';
import { ILoginResult, IError } from '../../core/types';

interface ILoginRequestBody {
  login: string;
  password: string;
}

interface IRegisterRequestBody {
  login: string;
  password: string;
  name: string;
  surname: string;
  imageUrl: string;
}

@Tags('Auth')
@Route('/auth')
export class AuthController extends Controller {
  @Response<IError>('406', 'Неверный пароль или логин')
  @Response<IError>('500', 'Ошибка сервера')
  @Post('/login')
  public async login(
    @Body() requestBody: ILoginRequestBody,
  ): Promise<ILoginResult> {
    const authService = Container.get(AuthService);
    return await authService.login(requestBody.login, requestBody.password);
  }

  // TODO
  // @Post('/logout')
  // public async logout(): Promise<void> {
  // }

  @Response<IError>('406', 'Пользователь уже существует')
  @Response<IError>('500', 'Ошибка сервера')
  @Post('/register')
  public async register(
    @Body() user: IRegisterRequestBody,
  ): Promise<void> {
    const authService = Container.get(AuthService);
    this.setStatus(202);
    return await authService.register(user);
  }
}
