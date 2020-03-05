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
  imageId: number;
}

@Tags('Auth')
@Route('/auth')
export class AuthController extends Controller {
  @Response<ILoginResult>('202', 'Аутентификация успешна')
  @Response<IError>('400', 'Ошибка при аутентификации')
  @Post('/login')
  public async login(
    @Body() requestBody: ILoginRequestBody,
  ): Promise<ILoginResult | IError> {
    const authService = Container.get(AuthService);
    this.setStatus(202);
    return authService.login(requestBody.login, requestBody.password);
  }

  @Post('/logout')
  public async logout(): Promise<void> {
    // TODO
  }

  @Response<IError>('400', 'Ошибка при регистрации')
  @Post('/register')
  public async register(
    @Body() requestBody: IRegisterRequestBody,
  ): Promise<void | IError> {
    // TODO
  }
}
