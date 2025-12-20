'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Level extends Model {
        static associate(models) {
            Level.hasMany(models.User, { foreignKey: 'level', sourceKey: 'level' });
        }
    }
    Level.init({
        level: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        minXp: DataTypes.INTEGER,
        rankName: DataTypes.STRING,
        iconUrl: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Level',
        timestamps: false
    });
    return Level;
};
