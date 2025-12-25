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
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        planetId: {
            type: DataTypes.INTEGER,
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
        tableName: 'Moons',
        timestamps: false
    });
    return Moon;
};
