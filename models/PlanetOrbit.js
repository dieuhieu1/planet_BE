'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PlanetOrbit extends Model {
        static associate(models) {
            PlanetOrbit.belongsTo(models.Planet, { foreignKey: 'planetId' });
        }
    }
    PlanetOrbit.init({
        planetId: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'Planets',
                key: 'id'
            }
        },
        axialTiltDeg: DataTypes.FLOAT,
        distanceFromSunKm: DataTypes.FLOAT,
        orbitalPeriodDays: DataTypes.FLOAT,
        rotationPeriodHours: DataTypes.FLOAT,
        orderFromSun: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'PlanetOrbit',
        timestamps: false
    });
    return PlanetOrbit;
};
