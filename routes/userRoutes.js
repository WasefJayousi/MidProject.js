const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,logoutUser ,verifyOTP,forgotPassword,resetPassword}  = require('../controllers/userController');
const { authenticateToken } = require('../config/verifytoken');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.delete('/profile', authenticateToken, deleteUser);
router.post('/logout', authenticateToken,logoutUser); 

router.post('/verify-otp', verifyOTP);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;