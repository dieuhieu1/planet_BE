const db = require('../models');
const { success, error, paginatedSuccess } = require('./responseHelper');

const gasController = {
    // Get all gases
    getAll: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await db.Gas.findAndCountAll({
                limit,
                offset
            });
            return paginatedSuccess(res, rows, count, page, limit);
        } catch (err) {
            return error(res, 'Failed to fetch gases', 500, err.message);
        }
    },

    // Get single gas
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const gas = await db.Gas.findByPk(id);
            if (!gas) {
                return error(res, 'Gas not found', 404);
            }
            return success(res, gas);
        } catch (err) {
            return error(res, 'Failed to fetch gas', 500, err.message);
        }
    },

    // Create gas
    create: async (req, res) => {
        try {
            const { name } = req.body;

            if (!name) {
                return error(res, 'Missing required fields', 400);
            }

            const existingGas = await db.Gas.findOne({ where: { name } });
            if (existingGas) {
                return error(res, 'Gas name already exists', 400);
            }

            const newGas = await db.Gas.create({ name });
            return success(res, newGas, 'Gas created successfully', 201);
        } catch (err) {
            return error(res, 'Failed to create gas', 500, err.message);
        }
    },

    // Update gas
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const [updated] = await db.Gas.update(data, { where: { id } });
            if (!updated) {
                return error(res, 'Gas not found or no changes made', 404);
            }

            const updatedGas = await db.Gas.findByPk(id);
            return success(res, updatedGas, 'Gas updated successfully');
        } catch (err) {
            return error(res, 'Failed to update gas', 500, err.message);
        }
    },

    // Delete gas
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await db.Gas.destroy({ where: { id } });
            if (!deleted) {
                return error(res, 'Gas not found', 404);
            }
            return success(res, null, 'Gas deleted successfully');
        } catch (err) {
            return error(res, 'Failed to delete gas', 500, err.message);
        }
    }
};

module.exports = gasController;
