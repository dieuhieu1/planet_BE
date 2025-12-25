'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AttemptDetail extends Model {
        static associate(models) {
            AttemptDetail.belongsTo(models.QuizAttempt, { foreignKey: 'attemptId' });
            AttemptDetail.belongsTo(models.Question, { foreignKey: 'questionId' });
            AttemptDetail.belongsTo(models.QuestionOption, { foreignKey: 'selectedOptionId' });
        }
    }
    AttemptDetail.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        attemptId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'QuizAttempts',
                key: 'id'
            }
        },
        questionId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Questions',
                key: 'id'
            }
        },
        selectedOptionId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'QuestionOptions',
                key: 'id'
            }
        },
        isCorrect: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'AttemptDetail',
        timestamps: false
    });
    return AttemptDetail;
};
