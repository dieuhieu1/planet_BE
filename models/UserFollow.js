'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserFollow extends Model {
        static associate(models) {
        }
    }
    UserFollow.init({
        followerId: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        followingId: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        createdAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'UserFollow',
        updatedAt: false
    });
    return UserFollow;
};
