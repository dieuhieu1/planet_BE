'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PlanetAtmosphere extends Model {
        static associate(models) {
            // Junction table usually doesn't need many associations unless it has extra logic
        }
    }
    PlanetAtmosphere.init({
        planetId: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'Planets',
                key: 'id'
            }
        },
        gasId: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'Gases',
                key: 'id'
            }
        },
        percentage: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'PlanetAtmosphere',
        timestamps: false
    });
    return PlanetAtmosphere;
};
