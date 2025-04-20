const { body } = require('express-validator');

const registerValidator = [
  body('name')
  .trim()
  .notEmpty().withMessage('Name is required')
  .isLength({ min: 6, max: 20 }).withMessage('Name must be between 6 and 20 characters')
  .matches(/^[a-zA-Z\s\-']+$/).withMessage('Name can only contain letters, spaces, hyphens, and apostrophes')
  .escape(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage('Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character')
    .escape(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .escape(),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .escape(),
];
const loginValidator = [
  body('emailOrName').notEmpty().withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const verifyOtpValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
];

const resetPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const updateProfileValidator = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

module.exports = {
  registerValidator,
  loginValidator,
  verifyOtpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator
};
