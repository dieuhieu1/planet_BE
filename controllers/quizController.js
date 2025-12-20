const db = require('../models');
const { success, error } = require('./responseHelper');

const quizController = {
    // Create Quiz with Questions & Options
    create: async (req, res) => {
        try {
            // Expected body: { title, ..., questions: [{ content, options: [{ content, isCorrect }] }] }
            const data = req.body;

            const newQuiz = await db.Quiz.create(data, {
                include: [{
                    model: db.Question,
                    include: [{ model: db.QuestionOption, as: 'options' }]
                }]
            });

            return success(res, newQuiz, 'Quiz created successfully', 201);
        } catch (err) {
            return error(res, 'Failed to create quiz', 400, err.message);
        }
    },

    // Get Quizzes by Planet
    getByPlanet: async (req, res) => {
        try {
            const { planetId } = req.params;
            const quizzes = await db.Quiz.findAll({
                where: { planetId }
            });
            return success(res, quizzes);
        } catch (err) {
            return error(res, 'Failed to fetch quizzes', 500, err.message);
        }
    },

    // Get Quiz Detail (for taking the quiz)
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const quiz = await db.Quiz.findOne({
                where: { id },
                include: [{
                    model: db.Question,
                    include: [{ model: db.QuestionOption, as: 'options' }]
                }]
            });

            if (!quiz) return error(res, 'Quiz not found', 404);
            return success(res, quiz);
        } catch (err) {
            return error(res, 'Failed to fetch quiz', 500, err.message);
        }
    },

    // Submit Attempt
    submitAttempt: async (req, res) => {
        try {
            const { userId, quizId, answers } = req.body;
            // answers: [{ questionId, selectedOptionId }]

            // 1. Calculate Score
            let correctCount = 0;
            const detailsToCreate = [];

            for (const ans of answers) {
                const option = await db.QuestionOption.findByPk(ans.selectedOptionId);
                const isCorrect = option ? option.get('isCorrect') : false;
                if (isCorrect) correctCount++;

                detailsToCreate.push({
                    questionId: ans.questionId,
                    selectedOptionId: ans.selectedOptionId,
                    isCorrect
                });
            }

            // Simple score logic
            const totalQuestions = answers.length; // Simplified
            const score = (correctCount / totalQuestions) * 10;

            // Fetch quiz to get reward
            const quiz = await db.Quiz.findByPk(quizId);
            const xpEarned = quiz ? quiz.get('rewardXp') : 0;

            // 2. Create Attempt
            const attempt = await db.QuizAttempt.create({
                id: 'attempt-' + Date.now(),
                userId,
                quizId,
                score,
                xpEarned,
                startedAt: new Date(), // Simulating start/finish same time for simple API
                finishedAt: new Date()
            });

            // 3. Create Details
            const detailsWithAttemptId = detailsToCreate.map(d => ({ ...d, id: 'detail-' + Date.now() + Math.random(), attemptId: attempt.get('id') }));
            await db.AttemptDetail.bulkCreate(detailsWithAttemptId);

            return success(res, { attempt, correctCount, totalQuestions, score }, 'Attempt submitted');
        } catch (err) {
            return error(res, 'Failed to submit attempt', 400, err.message);
        }
    }
};

module.exports = quizController;
