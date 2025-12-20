'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PlanetPhysical extends Model {
        static associate(models) {
            PlanetPhysical.belongsTo(models.Planet, { foreignKey: 'planetId' });
        }
    }
    PlanetPhysical.init({
        planetId: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'Planets',
                key: 'id'
            }
        },
        density: DataTypes.FLOAT,
        gravity: DataTypes.FLOAT,
        massKg: DataTypes.FLOAT,
        radiusKm: DataTypes.FLOAT,
        temperatureAvgC: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'PlanetPhysical',
        timestamps: false
    });
    return PlanetPhysical;
};
