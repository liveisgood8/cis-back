import { User } from '../models/user';
import { Errors } from '../utils/errors';

export interface IError {
  code: Errors;
  message?: string;
}

export interface ILoginResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}
