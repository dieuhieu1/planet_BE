const db = require('../models');
const { success, error } = require('./responseHelper');

const levelController = {
    // Get all levels
    getAll: async (req, res) => {
        try {
            const levels = await db.Level.findAll({
                order: [['level', 'ASC']]
            });
            return success(res, levels);
        } catch (err) {
            return error(res, 'Failed to fetch levels', 500, err.message);
        }
    }
};

module.exports = levelController;
