const db = require('../models');
const { success, error, paginatedSuccess } = require('./responseHelper');

const planetController = {
    // Get all planets (summary)
    getAll: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await db.Planet.findAndCountAll({
                include: [
                    { model: db.PlanetPhysical, as: 'physical' },
                    { model: db.PlanetOrbit, as: 'orbit' },
                    { model: db.Moon, as: 'moons' },
                    { model: db.Gas, as: 'gases', through: { attributes: ['percentage'] } }
                ],
                distinct: true, // Important for correct count with includes
                limit,
                offset
            });
            return paginatedSuccess(res, rows, count, page, limit);
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
        const transaction = await db.sequelize.transaction();
        try {
            const data = req.body;

            // 1. Validation
            const { physical, orbit, moons, gases } = data;

            if (!physical || typeof physical !== 'object') {
                return error(res, 'Missing or invalid "physical" data', 400);
            }
            if (!orbit || typeof orbit !== 'object') {
                return error(res, 'Missing or invalid "orbit" data', 400);
            }
            if (!Array.isArray(moons) || moons.length === 0) {
                // Or allow empty moons if that's valid business logic, user said "require full info" so enforcing presence is safer
                return error(res, 'Missing or invalid "moons" array', 400);
            }
            if (!Array.isArray(gases) || gases.length === 0) {
                return error(res, 'Missing or invalid "gases" array', 400);
            }

            // 2. Create Planet and direct associations
            const newPlanet = await db.Planet.create(data, {
                include: [
                    { model: db.PlanetPhysical, as: 'physical' },
                    { model: db.PlanetOrbit, as: 'orbit' },
                    { model: db.Moon, as: 'moons' }
                ],
                transaction
            });

            // 3. Link Gases (Atmosphere)
            // gases expected format: [{ gasId: "H2", percentage: 75 }, ...]
            const atmosphereData = gases.map(g => ({
                planetId: newPlanet.id,
                gasId: g.gasId,
                percentage: g.percentage
            }));

            await db.PlanetAtmosphere.bulkCreate(atmosphereData, { transaction });

            // 4. Commit and Return full structure
            await transaction.commit();

            // Fetch fully to return
            const finalPlanet = await db.Planet.findByPk(newPlanet.id, {
                include: [
                    { model: db.PlanetPhysical, as: 'physical' },
                    { model: db.PlanetOrbit, as: 'orbit' },
                    { model: db.Moon, as: 'moons' },
                    {
                        model: db.Gas,
                        as: 'gases',
                        through: { attributes: ['percentage'] }
                    }
                ]
            });

            return success(res, finalPlanet, 'Planet created successfully', 201);
        } catch (err) {
            await transaction.rollback();
            return error(res, 'Failed to create planet', 400, err.message);
        }
    },

    // Update Planet
    update: async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { id } = req.params;
            const data = req.body;

            // 1. Update basic info
            const [updated] = await db.Planet.update(data, { where: { id }, transaction });

            if (!updated) {
                // If ID valid but no changes in basic fields, we still proceed to update associations.
                // But we should check if planet exists first.
                const exists = await db.Planet.findByPk(id);
                if (!exists) {
                    await transaction.rollback();
                    return error(res, 'Planet not found', 404);
                }
            }

            // 2. Update/Upsert Associations if provided
            const { physical, orbit, moons, gases } = data;

            // Physical (One-to-One)
            if (physical) {
                await db.PlanetPhysical.upsert({ ...physical, planetId: id }, { transaction });
            }

            // Orbit (One-to-One)
            if (orbit) {
                await db.PlanetOrbit.upsert({ ...orbit, planetId: id }, { transaction });
            }

            // Moons (One-to-Many): Replace strategy (Delete all, Insert new) - simplest for "full update"
            if (moons && Array.isArray(moons)) {
                await db.Moon.destroy({ where: { planetId: id }, transaction });
                if (moons.length > 0) {
                    const moonsData = moons.map(m => ({ ...m, planetId: id }));
                    await db.Moon.bulkCreate(moonsData, { transaction });
                }
            }

            // Gases (Many-to-Many via PlanetAtmosphere): Replace strategy
            if (gases && Array.isArray(gases)) {
                await db.PlanetAtmosphere.destroy({ where: { planetId: id }, transaction });
                if (gases.length > 0) {
                    const atmosphereData = gases.map(g => ({
                        planetId: id,
                        gasId: g.gasId,
                        percentage: g.percentage
                    }));
                    await db.PlanetAtmosphere.bulkCreate(atmosphereData, { transaction });
                }
            }

            await transaction.commit();

            // Fetch and return updated full structure
            const updatedPlanet = await db.Planet.findByPk(id, {
                include: [
                    { model: db.PlanetPhysical, as: 'physical' },
                    { model: db.PlanetOrbit, as: 'orbit' },
                    { model: db.Moon, as: 'moons' },
                    { model: db.Gas, as: 'gases', through: { attributes: ['percentage'] } }
                ]
            });
            return success(res, updatedPlanet, 'Planet updated successfully');

        } catch (err) {
            await transaction.rollback();
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
