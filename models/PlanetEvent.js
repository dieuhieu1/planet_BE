'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PlanetEvent extends Model {
        static associate(models) {
            PlanetEvent.belongsTo(models.Planet, { foreignKey: 'planetId' });
        }
    }
    PlanetEvent.init({
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
        eventDate: DataTypes.DATEONLY,
        title: DataTypes.STRING,
        eventType: DataTypes.STRING,
        imageUrl: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'PlanetEvent',
        timestamps: false
    });
    return PlanetEvent;
};
