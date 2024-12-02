import { AppError } from './app.error';

/**
 * Erro que indica que o cliente foi autenticado mas ele não tem permissão para acessar o recurso solicitado.
 */
export class InsufficientPermissionError extends Error implements AppError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
    this.name = 'InsufficientPermissionError';
  }
}
