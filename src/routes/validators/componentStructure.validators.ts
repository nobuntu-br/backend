import { check } from "express-validator";

export const getPageStructureValidator = [
  check('pageName').notEmpty().withMessage('pageName is required'),
  check('userUID').notEmpty().withMessage('userUID is required'),
]
