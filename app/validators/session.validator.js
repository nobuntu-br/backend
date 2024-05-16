const { check, validationResult } = require('express-validator');

const validateSession = [
    check('userUID').notEmpty().withMessage('userUID is required'),
    check('user').notEmpty().withMessage('user is required'),
    check('tenantUID').notEmpty().withMessage('tenantUID is required'),
    check('accessToken').notEmpty().withMessage('accessToken is required'),
    check('initialDate').notEmpty().withMessage('initialDate is required'),
    check('finishSessionDate').notEmpty().withMessage('finishSessionDate is required'),
    check('stayConnected').notEmpty().withMessage('stayConnected is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

  module.exports = validateSession;
  