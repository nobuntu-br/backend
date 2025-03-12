import { check, param, query } from 'express-validator';
/**
 * Validador de campos
 */
export const createNewDatabaseCredentialValidator = [
  check('name').notEmpty().withMessage("The field 'name' is required and cannot be empty."),
  check('type').notEmpty().withMessage("The field 'type' is required and cannot be empty."),
  check('username').notEmpty().withMessage("The field 'username' is required and cannot be empty."),
  check('password').notEmpty().withMessage("The field 'password' is required and cannot be empty."),
  check('host').notEmpty().withMessage("The field 'host' is required and cannot be empty."),
  check('port').notEmpty().withMessage("The field 'port' is required and cannot be empty.").isNumeric().withMessage("The field 'port' is invalid format"),
  check('srvEnabled').notEmpty().withMessage("The field 'srvEnabled' is required and cannot be empty.").isBoolean().withMessage("The field 'srvEnabled' is invalid format"),
  check('tenantId').notEmpty().withMessage("The field 'tenantId' is required and cannot be empty.").isNumeric().withMessage("The field 'tenantId' is invalid format"),
]

export const findAllDatabaseCredentialValidator = [
  query('page').optional().isNumeric().withMessage("The field 'page' is invalid format"),
  query('limit').optional().isNumeric().withMessage("The field 'limit' is invalid format")
]

export const getDatabaseCredentialByTenantId = [
  param('id').notEmpty().withMessage("The field 'id' is required and cannot be empty.").isNumeric().withMessage("The field 'id' is invalid format")
]