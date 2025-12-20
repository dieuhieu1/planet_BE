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
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: DataTypes.STRING,
        chemicalFormula: DataTypes.STRING,
        colorHex: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Gas',
        timestamps: false
    });
    return Gas;
};
