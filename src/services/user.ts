import { Service } from 'typedi';
import { User } from '../models/user';
import { ISignInStatus } from '../core/interfaces/signin-status';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import config from '../config';

@Service()
export class UserService {
  constructor(
    private userRepository: Repository<User>,
  ) {}

  async signIn(login: string, password: string): Promise<ISignInStatus> {
    const user = await this.userRepository.createQueryBuilder('user')
        .select(['user.id', 'user.login', 'user.password', 'user.name'])
        .where('user.login = :login', {
          login: login,
        })
        .getOne();
    if (!user) {
      return {
        error: 'Пользователя с указанным логином не существует',
      };
    }
    /** TODO Передавать уже захешированный пароль со стороны клиента */
    if (this.getPasswordHash(password) !== user.password) {
      return {
        error: 'Некорректный пароль',
      };
    }
    delete user.password;
    return {
      user: user,
    };
  }

  private getPasswordHash(password: string): string {
    const saltedPassword = password + config.passwordSalt;
    const hash = createHash('md5').update(saltedPassword).digest('base64');
    return hash;
  }
}
