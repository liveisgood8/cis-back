import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { createHash } from 'crypto';
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
          406);
    }

    if (this.getPasswordHashWithSalt(password) !== user.password) {
      throw new CodeError(Errors.AUTH_WRONG_PASSWORD,
          406);
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

  public async register(
      login: string,
      password: string,
      name: string,
      surname: string,
      imageId: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        login: login,
      },
    });
    if (user) {
      throw new CodeError(Errors.REGISTER_USER_IS_EXIST, 406);
    }
    await this.userRepository.insert({
      login,
      password: this.getPasswordHashWithSalt(password),
      name,
      surname,
      imageId,
    });
  }

  private getPasswordHashWithSalt(password: string): string {
    const saltedPassword = password + config.passwordSalt;
    const hash = createHash('md5').update(saltedPassword).digest('base64');
    return hash;
  }
}
