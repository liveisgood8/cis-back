import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { createHash } from 'crypto';
import * as HttpStatus from 'http-status-codes';
import { User } from '../models/user';
import config from '../config';
import { ILoginResult } from '../core/types';
import { CodeError } from '../utils/error-with-code';
import { Errors } from '../utils/errors';

@Service()
export class AuthService {
  constructor(
    private userRepository: Repository<User>,
  ) {}

  public async login(login: string, password: string): Promise<ILoginResult> {
    const user = await this.userRepository.createQueryBuilder('user')
        .select(['user.id', 'user.login', 'user.password', 'user.name'])
        .where('user.login = :login', {
          login: login,
        })
        .getOne();
    if (!user) {
      throw new CodeError(Errors.AUTH_USER_NOT_FOUND,
          HttpStatus.NOT_ACCEPTABLE);
    }
    /**
     * TODO Передавать уже захешированный пароль со стороны клиента
     * TODO Вернуть хеширование пароля
     */
    if (password !== user.password) {
      throw new CodeError(Errors.AUTH_WRONG_PASSWORD,
          HttpStatus.NOT_ACCEPTABLE);
    }
    delete user.password;

    const jwtPayload = {
      user: user,
    };
    const accessToken = sign(jwtPayload, config.jwt.access.secretKey, {
      audience: config.jwt.audience,
      expiresIn: config.jwt.access.duration,
    });

    return {
      user,
      accessToken,
      refreshToken: 'todo',
    };
  }

  private getPasswordHash(password: string): string {
    const saltedPassword = password + config.passwordSalt;
    const hash = createHash('md5').update(saltedPassword).digest('base64');
    return hash;
  }
}
