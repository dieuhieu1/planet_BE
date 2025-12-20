'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class QuestionOption extends Model {
        static associate(models) {
            QuestionOption.belongsTo(models.Question, { foreignKey: 'questionId' });
        }
    }
    QuestionOption.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        questionId: {
            type: DataTypes.STRING,
            references: {
                model: 'Questions',
                key: 'id'
            }
        },
        content: DataTypes.STRING,
        isCorrect: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'QuestionOption',
        timestamps: false
    });
    return QuestionOption;
};
