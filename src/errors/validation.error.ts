import { AppError } from "./app.error";

export class ValidationError extends Error implements AppError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
    this.name = 'ValidationError';
  }
}
