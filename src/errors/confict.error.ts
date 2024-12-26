import { AppError } from './app.error';

export class ConflictError extends Error implements AppError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
    this.name = 'ConflictError';
  }
}
