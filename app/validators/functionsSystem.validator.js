const { check, validationResult } = require('express-validator');

const validateFunctionsSystem = [
    check('name').notEmpty().withMessage('name is required'),
    check('route').notEmpty().withMessage('route is required'),
    check('classname').notEmpty().withMessage('classname is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

  module.exports = validateFunctionsSystem;
  