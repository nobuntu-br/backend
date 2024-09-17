import { check, param, query } from 'express-validator';
/**
 * Validador de campos
 */
export const createNewUserValidator = [
  //TODO serão gerados com base no mapa mental
  check('UID').notEmpty().withMessage('UID is required'),
  check('userName').notEmpty().withMessage('username is required'),
  check('firstName').notEmpty().withMessage('firstname is required'),
  check('lastName').notEmpty().withMessage('lastname is required'),
  check('memberType').notEmpty().withMessage('memberType is required')
]

export const findAllUserValidator = [
  query('page').optional().isNumeric().withMessage('Only digits allowed in title page'),
  query('limit').optional().isNumeric().withMessage('Only digits allowed in title limit')
]

export const findUserByUIDValidator = [
  param('UID').notEmpty().withMessage('UID is required')
]

export const checkEmailExistValidator = [
  check('email').notEmpty().withMessage('email is required'),
]
