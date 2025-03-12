import { check, query } from 'express-validator';
/**
 * Validador de campos
 */
export const createNewRoleValidator = [
  //TODO serão gerados com base no mapa mental
  check('name').notEmpty().withMessage('Name is required'),
]

export const findAllRoleValidator = [
  query('page').optional().isNumeric().withMessage("The field 'page' is invalid format"),
  query('limit').optional().isNumeric().withMessage("The field 'limit' is invalid format")
]