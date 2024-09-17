import { AppError } from './app.error';

export class NotFoundError extends Error implements AppError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}
