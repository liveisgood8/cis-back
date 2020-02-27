import { IConfig } from './types';

export const config: IConfig = {
  expressPort: 8080,
  staticPath: './public',
  passwordSalt: 'password_salt',
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
