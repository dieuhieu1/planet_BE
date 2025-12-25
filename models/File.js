'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class File extends Model {
        static associate(models) {
            // associate with User if needed later
        }
    }
    File.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        filename: DataTypes.STRING,
        public_id: {
            type: DataTypes.STRING,
            unique: true
        },
        url: DataTypes.STRING,
        format: DataTypes.STRING,
        resource_type: DataTypes.STRING,
        details: DataTypes.JSON
    }, {
        sequelize,
        modelName: 'File',
    });
    return File;
};
