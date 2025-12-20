'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QuizAttempt extends Model {
        static associate(models) {
            QuizAttempt.belongsTo(models.User, { foreignKey: 'userId' });
            QuizAttempt.belongsTo(models.Quiz, { foreignKey: 'quizId' });
            QuizAttempt.hasMany(models.AttemptDetail, { foreignKey: 'attemptId' });
        }
    }
    QuizAttempt.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        quizId: {
            type: DataTypes.STRING,
            references: {
                model: 'Quizzes',
                key: 'id'
            }
        },
        score: DataTypes.FLOAT,
        xpEarned: DataTypes.INTEGER,
        startedAt: DataTypes.DATE,
        finishedAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'QuizAttempt',
        timestamps: false // already has specific fields
    });
    return QuizAttempt;
};
