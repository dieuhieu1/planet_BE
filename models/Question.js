'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Question extends Model {
        static associate(models) {
            Question.belongsTo(models.Quiz, { foreignKey: 'quizId' });
            Question.hasMany(models.QuestionOption, { foreignKey: 'questionId', as: 'options' });
        }
    }
    Question.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        quizId: {
            type: DataTypes.STRING,
            references: {
                model: 'Quizzes',
                key: 'id'
            }
        },
        content: DataTypes.TEXT,
        mediaUrl: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Question',
        timestamps: false
    });
    return Question;
};
