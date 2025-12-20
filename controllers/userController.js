const db = require('../models');
const { success, error } = require('./responseHelper');

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
    }
};

module.exports = userController;
