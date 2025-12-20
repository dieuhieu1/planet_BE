const jwt = require('jsonwebtoken');
const { error } = require('../controllers/responseHelper');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Bearer <token>
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return error(res, 'Access Denied: No Token Provided', 401);
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        req.user = verified; // { id, ... }
        next();
    } catch (err) {
        return error(res, 'Invalid Token', 403, err.message);
    }
};

module.exports = verifyToken;
