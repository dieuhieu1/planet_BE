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
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        questionId: {
            type: DataTypes.INTEGER,
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
