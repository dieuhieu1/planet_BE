'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UserFollow extends Model {
        static associate(models) {
        }
    }
    UserFollow.init({
        followerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        followingId: {
            type: DataTypes.INTEGER,
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
