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
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        quizId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Quizzes',
                key: 'id'
            }
        },
        score: DataTypes.FLOAT,
        xpEarned: DataTypes.INTEGER,
        currentIndex: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        startedAt: DataTypes.DATE,
        finishedAt: DataTypes.DATE,
        questionsOrder: {
            type: DataTypes.TEXT, // Stores JSON string of question IDs
            get() {
                const rawValue = this.getDataValue('questionsOrder');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('questionsOrder', JSON.stringify(value));
            }
        }
    }, {
        sequelize,
        modelName: 'QuizAttempt',
        timestamps: false // already has specific fields
    });
    return QuizAttempt;
};
