import { AppError } from './app.error';

export class TooManyRequestsError extends Error implements AppError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 429;
    this.name = 'TooManyRequestsError';
  }
}
