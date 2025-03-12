import { check, param, query } from 'express-validator';
/**
 * Validador de campos
 */
export const createNewDatabasePermissionValidator = [
  check('UID').notEmpty().withMessage("The field 'UID' is required and cannot be empty."),
  check('tenantId').notEmpty().withMessage("The field 'tenantId' is required and cannot be empty."),
  check('tenantCredentialId').notEmpty().withMessage("The field 'tenantCredentialId' is required and cannot be empty."),
]

export const findAllDatabasePermissionValidator = [
  query('page').optional().isNumeric().withMessage("The field 'page' is invalid format"),
  query('limit').optional().isNumeric().withMessage("The field 'limit' is invalid format")
]