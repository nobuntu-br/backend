import { check } from "express-validator";

export const refreshTokenValidator = [
  check('refreshToken').notEmpty().withMessage('refreshToken is required'),
]