import { IConfig } from './types';

export const config: IConfig = {
  expressPort: 80,
  staticPath: './public',
  passwordSalt: 'password_salt',
  jwt: {
    audience: 'www.cis.com',
    access: {
      secretKey: 'jwt_access_secret_key',
      duration: '30min',
    },
    refresh: {
      secretKey: 'jwt_refresh_secret_key',
      duration: '30d',
    },
  },
};
