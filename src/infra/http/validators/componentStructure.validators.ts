import { check } from "express-validator";

export const getPageStructureValidator = [
  check('componentName').notEmpty().withMessage("The field 'componentName' is required and cannot be empty."),
  check('userId').notEmpty().withMessage("The field 'userId' is required and cannot be empty."),
]
