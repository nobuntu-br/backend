const { check, validationResult } = require('express-validator');

const validateFunctionsSystemRoles = [
    check('Roles').notEmpty().withMessage('Roles is required'),
    check('FunctionSystem').notEmpty().withMessage('FunctionSystem is required'),
    check('authorized').notEmpty().withMessage('authorized is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

  module.exports = validateFunctionsSystemRoles;
  