import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

/**
 * Fará a validação do dados do cabeçario da requisição. Caso for encontrado algum erro com base no validadores, será enviado o erro para o usuário.
 * @param req Dados da requisição
 * @param res Resposta da requisição
 * @param next 
 * @returns 
 */
export default function validateHeaders(req: Request, res: Response, next: NextFunction) {
  // Obtem os erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    // Construir a mensagem de erro
    const missingFields = errors.array().map(error => error.msg);
    const errorMessage = `${missingFields.join(', ')}`;

    return res.status(400).json({ errors: errorMessage });
  }
  next();
};