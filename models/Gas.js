'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Gas extends Model {
        static associate(models) {
            Gas.belongsToMany(models.Planet, { through: models.PlanetAtmosphere, foreignKey: 'gasId', as: 'planets' });
        }
    }
    Gas.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Gas',
        tableName: 'Gases',
        timestamps: false
    });
    return Gas;
};
