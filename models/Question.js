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
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quizId: {
            type: DataTypes.INTEGER,
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
