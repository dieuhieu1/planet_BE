const db = require('../models');
const { success, error, paginatedSuccess } = require('./responseHelper');

const userController = {
    // Create/Register User
    create: async (req, res) => {
        try {
            const data = req.body;
            const newUser = await db.User.create(data);
            return success(res, newUser, 'User created successfully', 201);
        } catch (err) {
            return error(res, 'Failed to create user', 400, err.message);
        }
    },

    // Get User Profile
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await db.User.findOne({
                where: { id },
                include: [
                    { model: db.Level },
                    { model: db.User, as: 'Followers', attributes: ['id', 'username'] },
                    { model: db.User, as: 'Following', attributes: ['id', 'username'] }
                ]
            });

            if (!user) {
                return error(res, 'User not found', 404);
            }

            return success(res, user);
        } catch (err) {
            return error(res, 'Failed to fetch user profile', 500, err.message);
        }
    },

    // Follow User
    follow: async (req, res) => {
        try {
            const { id } = req.params; // ID of the user to be followed (followingId)
            const { followerId } = req.body; // In a real app, from auth token

            if (!followerId) return error(res, 'Follower ID required', 400);

            await db.UserFollow.create({
                followerId,
                followingId: id
            });

            return success(res, null, 'Followed successfully');
        } catch (err) {
            return error(res, 'Failed to follow user', 400, err.message);
        }
    },

    // User Update Profile (No email/password)
    updateProfile: async (req, res) => {
        try {
            const { id } = req.user; // From verifyToken
            const { email, password, role, ...updateData } = req.body;

            // Prevent updating restricted fields
            if (email || password || role) {
                return error(res, 'Cannot update email, password, or role via this endpoint', 400);
            }

            const user = await db.User.findByPk(id);
            if (!user) return error(res, 'User not found', 404);

            await user.update(updateData);

            return success(res, user, 'Profile updated successfully');
        } catch (err) {
            return error(res, 'Failed to update profile', 500, err.message);
        }
    },

    // Admin Get All Users
    getAllUsers: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await db.User.findAndCountAll({
                attributes: { exclude: ['password', 'refreshToken'] },
                limit,
                offset
            });
            return paginatedSuccess(res, rows, count, page, limit);
        } catch (err) {
            return error(res, 'Failed to fetch users', 500, err.message);
        }
    },

    // Admin Update User (Any field)
    adminUpdateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const user = await db.User.findByPk(id);
            if (!user) return error(res, 'User not found', 404);

            // If updating password, hash it (if provided)
            if (updateData.password) {
                const bcrypt = require('bcryptjs');
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }

            await user.update(updateData);
            return success(res, user, 'User updated successfully');
        } catch (err) {
            return error(res, 'Failed to update user', 500, err.message);
        }
    },

    // Admin Delete User
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await db.User.findByPk(id);
            if (!user) return error(res, 'User not found', 404);

            await user.destroy();
            return success(res, null, 'User deleted successfully');
        } catch (err) {
            return error(res, 'Failed to delete user', 500, err.message);
        }
    }
};

module.exports = userController;
