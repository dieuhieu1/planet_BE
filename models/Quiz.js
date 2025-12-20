'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Quiz extends Model {
        static associate(models) {
            Quiz.belongsTo(models.Planet, { foreignKey: 'planetId' });
            Quiz.belongsTo(models.User, { foreignKey: 'creatorId' });
            Quiz.hasMany(models.Question, { foreignKey: 'quizId' });
            Quiz.hasMany(models.QuizAttempt, { foreignKey: 'quizId' });
        }
    }
    Quiz.init({
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        planetId: {
            type: DataTypes.STRING,
            references: {
                model: 'Planets',
                key: 'id'
            }
        },
        creatorId: {
            type: DataTypes.STRING,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        rewardXp: DataTypes.INTEGER,
        minLevel: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Quiz',
    });
    return Quiz;
};
