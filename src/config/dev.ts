import { IConfig } from './types';

export const config: IConfig = {
  expressPort: 8080,
  staticPath: './public',
  passwordSalt: 'password_salt_very_strong',
  mail: {
    from: 'lemeshonok12@yandex.ru',
  },
  jwt: {
    audience: 'localhost',
    access: {
      secretKey: 'jwt_access_secret_key',
      duration: '30d',
    },
    refresh: {
      secretKey: 'jwt_refresh_secret_key',
      duration: '30d',
    },
  },
};
