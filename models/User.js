'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Level, { foreignKey: 'level', targetKey: 'level' });

            User.belongsToMany(models.User, {
                through: models.UserFollow,
                as: 'Followers',
                foreignKey: 'followingId',
                otherKey: 'followerId'
            });
            User.belongsToMany(models.User, {
                through: models.UserFollow,
                as: 'Following',
                foreignKey: 'followerId',
                otherKey: 'followingId'
            });

            User.hasMany(models.Quiz, { foreignKey: 'creatorId' });
            User.hasMany(models.QuizAttempt, { foreignKey: 'userId' });
        }
    }
    User.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            // allowNull: true // Allow null for OAuth users later if needed
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        avatarUrl: DataTypes.STRING,
        level: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Levels',
                key: 'level'
            }
        },
        totalXp: DataTypes.INTEGER,
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true // UserFollow has timestamp, User usually has timestamp too
    });
    return User;
};
