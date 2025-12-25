const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { success, error } = require('./responseHelper');
const { sendEmail } = require('../services/emailService');
const { getForgotPasswordTemplate, getVerifyEmailTemplate } = require('../services/emailTemplates');

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.get('id'), username: user.get('username') },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: process.env.JWT_ACCESS_EXPIRE }
    );

    const refreshToken = jwt.sign(
        { id: user.get('id') },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );

    return { accessToken, refreshToken };
};

const authController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            if (typeof password !== 'string') {
                return error(res, 'Invalid password format', 400);
            }

            const existingUser = await db.User.findOne({ where: { username } });
            if (existingUser) return error(res, 'Username already exists', 400);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Generate Verification Token
            const verificationToken = jwt.sign(
                { email },
                process.env.JWT_ACCESS_KEY,
                { expiresIn: '1d' }
            );

            const newUser = await db.User.create({
                username,
                email,
                password: hashedPassword,
                level: 1,
                totalXp: 0,
                isVerified: false,
                verificationToken
            });

            // Send Verification Email
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const verifyLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
            const subject = 'Welcome to Planet Web - Verify Your Email';
            const html = getVerifyEmailTemplate(verifyLink);
            const text = `Please verify your email by clicking: ${verifyLink}`;

            await sendEmail(email, subject, text, html);

            return success(res, { id: newUser.get('id'), username: newUser.get('username') }, 'User registered. Please check email to verify.', 201);
        } catch (err) {
            return error(res, 'Registration failed', 500, err.message);
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (typeof password !== 'string') {
                return error(res, 'Invalid password format', 400);
            }

            const user = await db.User.findOne({ where: { username } });
            if (!user) return error(res, 'User not found', 404);
            const hashedPassword = user.get('password');
            if (!hashedPassword) return error(res, 'Invalid credentials (no password set)', 400);

            const validPass = await bcrypt.compare(password, hashedPassword);
            if (!validPass) return error(res, 'Invalid password', 400);

            const tokens = generateTokens(user);
            await user.update({ refreshToken: tokens.refreshToken });
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: false, // Set to true in production
                path: '/',
                sameSite: 'lax'
            });

            return success(res, {
                user: {
                    id: user.get('id'),
                    username: user.get('username'),
                    email: user.get('email'),
                    avatarUrl: user.get('avatarUrl'),
                    level: user.get('level'),
                    totalXp: user.get('totalXp'),
                    isVerified: user.get('isVerified'),
                    role: user.get('role')
                },
                accessToken: tokens.accessToken
            }, 'Login successful');
        } catch (err) {
            return error(res, 'Login failed', 500, err.message);
        }
    },

    refreshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            console.log(req.cookies);
            if (!refreshToken) return error(res, 'Refresh Token required', 401);

            let payload = {};
            try {
                payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
            } catch (e) {
                if (e.name === 'TokenExpiredError') {
                    return error(res, 'Refresh Token expired', 403);
                }
                return error(res, 'Invalid Refresh Token', 403);
            }

            const user = await db.User.findByPk(payload.id);
            if (!user || user.get('refreshToken') !== refreshToken) {
                return error(res, 'Invalid Refresh Token (not matched)', 403);
            }

            const newTokens = generateTokens(user);

            await user.update({ refreshToken: newTokens.refreshToken });

            res.cookie('refreshToken', newTokens.refreshToken, {
                httpOnly: true,
                secure: false, // Set to true in production
                path: '/',
                sameSite: 'Lax'
            });

            return success(res, { accessToken: newTokens.accessToken }, 'Token refreshed');
        } catch (err) {
            return error(res, 'Refresh failed', 500, err.message);
        }
    },

    logout: async (req, res) => {
        try {
            // User ID comes from verifyToken middleware (req.user)
            const userId = req.user.id;

            await db.User.update({ refreshToken: null }, { where: { id: userId } });
            res.clearCookie('refreshToken');
            res.clearCookie('accessToken');
            return success(res, null, 'Logged out successfully');
        } catch (err) {
            return error(res, 'Logout failed', 500, err.message);
        }
    },

    changePassword: async (req, res) => {
        try {
            const { userId, oldPassword, newPassword } = req.body;
            if (!userId || !oldPassword || !newPassword) {
                return error(res, 'Missing required fields', 400);
            }

            const user = await db.User.findByPk(userId);
            if (!user) return error(res, 'User not found', 404);

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) return error(res, 'Old password incorrect', 400);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await user.update({ password: hashedPassword });
            return success(res, null, 'Password changed successfully');
        } catch (err) {
            return error(res, 'Change password failed', 500, err.message);
        }
    },

    verifyEmail: async (req, res) => {
        try {
            const { token } = req.body;
            if (!token) return error(res, 'Token is required', 400);

            let payload = {};
            try {
                payload = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            } catch (e) {
                return error(res, 'Invalid or expired verification token', 400);
            }

            const user = await db.User.findOne({ where: { email: payload.email } });
            if (!user) return error(res, 'User not found', 404);

            if (user.isVerified) {
                return success(res, null, 'Email already verified');
            }

            await user.update({ isVerified: true, verificationToken: null });
            return success(res, null, 'Email verified successfully');
        } catch (err) {
            return error(res, 'Verification failed', 500, err.message);
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await db.User.findOne({ where: { email } });
            if (!user) return error(res, 'User not found', 404);

            // Create a short-lived token (15 mins)
            const resetToken = jwt.sign(
                { id: user.id },
                process.env.JWT_ACCESS_KEY, // Or a dedicated JWT_RESET_KEY
                { expiresIn: '15m' }
            );

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
            const subject = 'Password Reset Request';
            const html = getForgotPasswordTemplate(resetLink);
            const text = `Click link to reset: ${resetLink}`;

            await sendEmail(email, subject, text, html);

            return success(res, null, 'Reset email sent');
        } catch (err) {
            return error(res, 'Forgot password failed', 500, err.message);
        }
    },

    sendVerificationEmail: async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) return error(res, 'Email is required', 400);

            const user = await db.User.findOne({ where: { email } });
            if (!user) return error(res, 'User not found', 404);

            if (user.isVerified) {
                return error(res, 'Email already verified', 400);
            }

            // Generate new token
            const verificationToken = jwt.sign(
                { email },
                process.env.JWT_ACCESS_KEY,
                { expiresIn: '1d' }
            );

            await user.update({ verificationToken });

            // Send Email
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const verifyLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
            const subject = 'Veriy Your Email - Planet Web';
            const html = getVerifyEmailTemplate(verifyLink);
            const text = `Please verify your email by clicking: ${verifyLink}`;

            await sendEmail(email, subject, text, html);

            return success(res, null, 'Verification email sent');
        } catch (err) {
            return error(res, 'Failed to send verification email', 500, err.message);
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;
            console.log(req.body)
            if (!token || !newPassword) return error(res, 'Missing token or new password', 400);

            let payload = {};
            try {
                payload = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            } catch (e) {
                return error(res, 'Invalid or expired token', 400);
            }

            const user = await db.User.findByPk(payload.id);
            if (!user) return error(res, 'User not found', 404);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await user.update({ password: hashedPassword });
            return success(res, null, 'Password reset successfully');
        } catch (err) {
            return error(res, 'Reset password failed', 500, err.message);
        }
    }
};

module.exports = authController;
