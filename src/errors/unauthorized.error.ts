import { AppError } from './app.error';

/**
 * Erro que indica que o usuário ou o cliente não foi autenticado adequadamente
 */
export class UnauthorizedError extends Error implements AppError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
    this.name = 'UnauthorizedError';
    this.message = message;
  }
}
