import { BAD_REQUEST } from 'http-status-codes';
import { Errors } from './errors';

export class CodeError extends Error {
  constructor(
    public readonly code: Errors,
    public readonly status: number = BAD_REQUEST,
    message?: string,
  ) {
    super(message);
  }
}
