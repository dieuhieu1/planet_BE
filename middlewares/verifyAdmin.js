const { error } = require('../controllers/responseHelper');
const db = require('../models');

const verifyAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return error(res, 'Access Denied: Not Authenticated', 401);
        }

        const user = await db.User.findByPk(req.user.id);

        if (!user) {
            return error(res, 'User not found', 404);
        }

        if (user.role !== 'admin') {
            return error(res, 'Access Denied: Admins Only', 403);
        }

        next();
    } catch (err) {
        return error(res, 'Authorization failed', 500, err.message);
    }
};

module.exports = verifyAdmin;
