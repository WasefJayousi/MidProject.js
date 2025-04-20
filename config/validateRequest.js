const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      msg: err.msg,
      path: err.path
    }));

    return res.status(422).json({
      message: 'Validation error',
      errors: formattedErrors
    });
  }
  next();
};

module.exports = validateRequest;
