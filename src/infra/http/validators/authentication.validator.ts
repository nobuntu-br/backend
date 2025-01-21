import { check } from "express-validator";

export const sendPasswordResetLintToEmailValidator = [
  check('email').isEmail().withMessage('email is required')
];

export const resetPasswordValidator = [
  check('email').isEmail().withMessage('email is required'),
  check('resetPasswordToken').notEmpty().withMessage('resetPasswordToken is required'),
];