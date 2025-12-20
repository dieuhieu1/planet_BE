const db = require('../models');
const { success, error } = require('./responseHelper');

const planetController = {
    // Get all planets (summary)
    getAll: async (req, res) => {
        try {
            const planets = await db.Planet.findAll({
                attributes: ['id', 'planetId', 'nameVi', 'nameEn', 'image2d', 'type']
            });
            return success(res, planets);
        } catch (err) {
            return error(res, 'Failed to fetch planets', 500, err.message);
        }
    },

    // Get planet detail
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const planet = await db.Planet.findOne({
                where: { id },
                include: [
                    { model: db.PlanetPhysical, as: 'physical' },
                    { model: db.PlanetOrbit, as: 'orbit' },
                    { model: db.Moon, as: 'moons' },
                    { model: db.PlanetEvent, as: 'events' },
                    { model: db.Gas, as: 'gases', through: { attributes: ['percentage'] } }
                ]
            });

            if (!planet) {
                return error(res, 'Planet not found', 404);
            }

            return success(res, planet);
        } catch (err) {
            return error(res, 'Failed to fetch planet details', 500, err.message);
        }
    },

    // Create Planet
    create: async (req, res) => {
        try {
            const data = req.body;
            const newPlanet = await db.Planet.create(data, {
                include: [
                    { model: db.PlanetPhysical, as: 'physical' },
                    { model: db.PlanetOrbit, as: 'orbit' }
                    // Associations like moons/events usually added separately or via deeply nested create if structured right
                ]
            });
            return success(res, newPlanet, 'Planet created successfully', 201);
        } catch (err) {
            return error(res, 'Failed to create planet', 400, err.message);
        }
    },

    // Update Planet
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const [updated] = await db.Planet.update(data, { where: { id } });

            if (!updated) {
                return error(res, 'Planet not found/no changes', 404);
            }

            const updatedPlanet = await db.Planet.findByPk(id);
            return success(res, updatedPlanet, 'Planet updated successfully');
        } catch (err) {
            return error(res, 'Failed to update planet', 400, err.message);
        }
    },

    // Delete Planet
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await db.Planet.destroy({ where: { id } });

            if (!deleted) {
                return error(res, 'Planet not found', 404);
            }

            return success(res, null, 'Planet deleted successfully');
        } catch (err) {
            return error(res, 'Failed to delete planet', 500, err.message);
        }
    }
};

module.exports = planetController;
