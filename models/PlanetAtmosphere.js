'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PlanetAtmosphere extends Model {
        static associate(models) {
            PlanetAtmosphere.belongsTo(models.Planet, { foreignKey: 'planetId' });
            PlanetAtmosphere.belongsTo(models.Gas, { foreignKey: 'gasId' });
        }
    }
    PlanetAtmosphere.init({
        planetId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Planets',
                key: 'id'
            }
        },
        gasId: {
            type: DataTypes.INTEGER,
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
