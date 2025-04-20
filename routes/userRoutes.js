const express = require('express');
const router = express.Router();
const usercontroller = require('../controller/userController');
const { authenticateToken } = require('../config/verifytoken');
const validate = require('../config/validateRequest');
const {
  registerValidator,
  loginValidator,
  verifyOtpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator
} = require('../validators/userValidator');

// register user
router.post('/register', registerValidator, validate, usercontroller.registerUser);

// login user
router.post('/login', loginValidator, validate, usercontroller.loginUser);

// get user profile
router.get('/profile', authenticateToken, usercontroller.getUserProfile);

// update user profile
router.put('/profile', authenticateToken, updateProfileValidator, validate, usercontroller.updateUserProfile);

// delete user
router.delete('/profile', authenticateToken, usercontroller.deleteUser);

// logout user
router.post('/logout', authenticateToken, usercontroller.logoutUser);

// verify OTP
router.post('/verify-otp', verifyOtpValidator, validate, usercontroller.verifyOTP);

// forgot password
router.post('/forgot-password', forgotPasswordValidator, validate, usercontroller.forgotPassword);

// reset password
router.post('/reset-password', resetPasswordValidator, validate, usercontroller.resetPassword);

module.exports = router;
