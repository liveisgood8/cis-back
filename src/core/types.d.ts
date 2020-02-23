import { User } from '../models/user';

export interface IError {
  error: Error;
}

export interface ILoginResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}
