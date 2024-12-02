import { AppError } from './app.error';

export class UnknownError extends Error implements AppError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 500;
    this.name = 'UnknownError';
  }
}
