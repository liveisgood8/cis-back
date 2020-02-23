import { Service } from 'typedi';
import { User } from '../models/user';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import config from '../config';
import { ILoginResult } from '../core/types';
import { sign } from 'jsonwebtoken';

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
      throw new Error('Пользователя с указанным логином не существует');
    }
    /**
     * TODO Передавать уже захешированный пароль со стороны клиента
     * TODO Вернуть хеширование пароля
     */
    if (password !== user.password) {
      throw new Error('Неверный пароль');
    }
    delete user.password;

    const jwtPayload = {
      user: user,
    };
    const accessToken = sign(jwtPayload, config.jwt.secretKey, {
      audience: config.jwt.audience,
      expiresIn: config.jwt.duration,
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
