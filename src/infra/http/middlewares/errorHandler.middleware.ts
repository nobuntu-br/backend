import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../errors/app.error';

/**
 * Middleware que enviará para o usuário uma descrição do erro que ocorreu
 * @param error Dados do erro ocorrido
 */
export function errorHandler(error: AppError, request: Request, response: Response, nextFunction: NextFunction) {
  const statusCode : number = error.statusCode || 500;
  const message : string = error.message || 'Internal Server Error';

  response.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
}
