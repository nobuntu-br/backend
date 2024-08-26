import { check, param, query } from 'express-validator';
/**
 * Validador de campos
 */
export const createNewTenantValidator = [
  //TODO serão gerados com base no mapa mental
  check('name').notEmpty().withMessage('Name is required'),
]

export const findAllTenantValidator = [
  query('page').optional().isNumeric().withMessage('Only digits allowed in title page'),
  query('limit').optional().isNumeric().withMessage('Only digits allowed in title limit')
]

export const findUserByUIDValidator =[
  param('UID').notEmpty().withMessage('UID is required')
]