import { Controller, Post, Route, BodyProp } from 'tsoa';
import Container from 'typedi';
import { AuthService } from '../../services/auth';
import { ILoginResult } from '../../core/types';

@Route('/auth')
export class AuthController extends Controller {
  @Post('/login')
  public async login(
    @BodyProp('login') login: string,
    @BodyProp('password') password: string,
  ): Promise<ILoginResult> {
    const authService = Container.get(AuthService);
    return authService.login(login, password);
  }
}
