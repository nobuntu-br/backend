const { check, validationResult } = require('express-validator');

const validateUser = [
    check('UID').notEmpty().withMessage('UID is required'),
    check('TenantUID').notEmpty().withMessage('TenantUID is required'),
    check('firstName').notEmpty().withMessage('firstName is required'),
    check('lastName').notEmpty().withMessage('lastName is required'),
    check('isAdministrator').notEmpty().withMessage('isAdministrator is required'),
    check('memberType').notEmpty().withMessage('memberType is required'),  
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

  module.exports = validateUser;
  