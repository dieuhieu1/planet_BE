'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Planet extends Model {
        static associate(models) {
            Planet.hasOne(models.PlanetPhysical, { foreignKey: 'planetId', as: 'physical' });
            Planet.hasOne(models.PlanetOrbit, { foreignKey: 'planetId', as: 'orbit' });
            Planet.hasMany(models.Moon, { foreignKey: 'planetId', as: 'moons' });
            Planet.belongsToMany(models.Gas, { through: models.PlanetAtmosphere, foreignKey: 'planetId', as: 'gases' });
            Planet.hasMany(models.Quiz, { foreignKey: 'planetId', as: 'quizzes' });
        }
    }
    Planet.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        planetId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            comment: "Slug unique"
        },
        nameVi: DataTypes.STRING,
        nameEn: DataTypes.STRING,
        type: DataTypes.STRING,
        shortDescription: DataTypes.STRING,
        overview: DataTypes.TEXT,
        image2d: DataTypes.STRING,
        model3d: DataTypes.STRING,
        hasAtmosphere: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Planet',
    });
    return Planet;
};
