import { check, param, query } from 'express-validator';
/**
 * Validador de campos
 */
export const createNewUserValidator = [
  //TODO serão gerados com base no mapa mental
  check('UID').notEmpty().withMessage('UID is required'),
  check('username').notEmpty().withMessage('username is required'),
  check('firstName').notEmpty().withMessage('firstName is required'),
  check('lastName').notEmpty().withMessage('lastName is required'),
  check('isAdministrator').notEmpty().withMessage('isAdministrator is required'),
  check('memberType').notEmpty().withMessage('memberType is required')
]

export const findAllUserValidator = [
  query('page').optional().isNumeric().withMessage('Only digits allowed in title page'),
  query('limit').optional().isNumeric().withMessage('Only digits allowed in title limit')
]

export const findUserByUIDValidator = [
  param('UID').notEmpty().withMessage('UID is required')
]
