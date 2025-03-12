import { check } from "express-validator";

export const sendPasswordResetLintToEmailValidator = [
  check('email').isEmail().withMessage("The field 'email' is required and cannot be empty.")
];

export const resetPasswordValidator = [
  check('password').notEmpty().withMessage("The field 'password' is required and cannot be empty."),
  check('resetPasswordToken').notEmpty().withMessage("The field 'resetPasswordToken' is required and cannot be empty."),
];