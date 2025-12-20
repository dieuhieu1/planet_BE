const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', verifyToken, authController.logout); // Protect logout if desired
router.post('/change-password', verifyToken, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);

module.exports = router;
