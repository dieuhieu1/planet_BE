'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Moon extends Model {
        static associate(models) {
            Moon.belongsTo(models.Planet, { foreignKey: 'planetId' });
        }
    }
    Moon.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        planetId: {
            type: DataTypes.STRING,
            references: {
                model: 'Planets',
                key: 'id'
            }
        },
        name: DataTypes.STRING,
        diameterKm: DataTypes.FLOAT,
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Moon',
        timestamps: false
    });
    return Moon;
};
