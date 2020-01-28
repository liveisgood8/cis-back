import { IStatus } from './status';
import { User } from '../../models/user';

export interface ISignInStatus extends IStatus{
  user?: User;
}
