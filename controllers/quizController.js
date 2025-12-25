const db = require('../models');
const { Op } = require('sequelize');
const { success, error, paginatedSuccess } = require('./responseHelper');

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

    // Add Question to existing Quiz
    // Add Question(s) to existing Quiz
    addQuestion: async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { id } = req.params; // quizId
            let questionsData = req.body.questions; // Expecting { questions: [...] }

            // Fallback for legacy single question support
            if (!questionsData && req.body.content) {
                questionsData = [req.body];
            }

            if (!questionsData || !Array.isArray(questionsData) || questionsData.length === 0) {
                return error(res, 'No questions provided', 400);
            }

            const quiz = await db.Quiz.findByPk(id);
            if (!quiz) {
                await transaction.rollback();
                return error(res, 'Quiz not found', 404);
            }

            const createdQuestions = [];

            for (const qData of questionsData) {
                const { content, mediaUrl, options } = qData;

                // 1. Create Question
                const newQuestion = await db.Question.create({
                    quizId: id,
                    content,
                    mediaUrl: mediaUrl || null
                }, { transaction });

                // 2. Create Options if provided
                if (options && Array.isArray(options) && options.length > 0) {
                    const optionsWithId = options.map(opt => ({
                        content: opt.content,
                        isCorrect: opt.isCorrect,
                        questionId: newQuestion.id
                    }));
                    await db.QuestionOption.bulkCreate(optionsWithId, { transaction });
                }

                createdQuestions.push(newQuestion);
            }

            await transaction.commit();

            // Fetch final result to return (full structure)
            const finalQuestions = await db.Question.findAll({
                where: { id: createdQuestions.map(q => q.id) },
                include: [{ model: db.QuestionOption, as: 'options' }]
            });

            return success(res, finalQuestions, 'Questions added successfully', 201);
        } catch (err) {
            await transaction.rollback();
            return error(res, 'Failed to add questions', 400, err.message);
        }
    },

    // Get Quizzes by Planet
    getByPlanet: async (req, res) => {
        try {
            const { planetId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await db.Quiz.findAndCountAll({
                where: { planetId },
                limit,
                offset
            });
            return paginatedSuccess(res, rows, count, page, limit);
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

    // Get Single Question Detail
    getQuestion: async (req, res) => {
        try {
            const { id } = req.params; // questionId
            const question = await db.Question.findByPk(id, {
                include: [{ model: db.QuestionOption, as: 'options' }]
            });

            if (!question) return error(res, 'Question not found', 404);
            return success(res, question);
        } catch (err) {
            return error(res, 'Failed to fetch question', 500, err.message);
        }
    },

    // Update Quiz (Full Update with Questions)
    update: async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { id } = req.params;
            const { title, description, planetId, rewardXp, minLevel, questions } = req.body;

            const quiz = await db.Quiz.findByPk(id);
            if (!quiz) {
                await transaction.rollback();
                return error(res, 'Quiz not found', 404);
            }

            // 1. Update Quiz Basic Info
            await quiz.update({ title, description, planetId, rewardXp, minLevel }, { transaction });

            // 2. Update Questions (Upsert Strategy)
            if (questions && Array.isArray(questions)) {
                // Get all existing question IDs for this quiz to handle deletions if needed
                // For now, let's assume we update/create provided ones.
                // If the user wants to "sync" (delete missing), we would need that logic.
                // Let's implement robust Sync:
                // - IDs in request -> Update
                // - IDs in DB but not in request -> Delete? (Or keep? usually Sync deletes)
                // - No ID in request -> Create

                // Current DB IDs
                const existingQs = await db.Question.findAll({ where: { quizId: id }, attributes: ['id'], transaction });
                const existingIds = existingQs.map(q => q.id);

                const incomingIds = questions.filter(q => q.id).map(q => q.id);
                const toDeleteIds = existingIds.filter(eid => !incomingIds.includes(eid));

                // A. Delete missing questions
                if (toDeleteIds.length > 0) {
                    await db.QuestionOption.destroy({
                        where: { questionId: toDeleteIds },
                        transaction
                    });
                    await db.Question.destroy({ where: { id: toDeleteIds }, transaction });
                }

                // B. Upsert (Update or Create)
                for (const qData of questions) {
                    let questionInstance;

                    if (qData.id && existingIds.includes(qData.id)) {
                        // Update existing
                        await db.Question.update({
                            content: qData.content,
                            mediaUrl: qData.mediaUrl
                        }, { where: { id: qData.id }, transaction });
                        questionInstance = { id: qData.id }; // Placeholder
                    } else {
                        // Create new
                        questionInstance = await db.Question.create({
                            quizId: id,
                            content: qData.content,
                            mediaUrl: qData.mediaUrl
                        }, { transaction });
                    }

                    // C. Handle Options for this Question (Replace strategy)
                    if (qData.options && Array.isArray(qData.options)) {
                        await db.QuestionOption.destroy({ where: { questionId: questionInstance.id }, transaction });

                        const newOptions = qData.options.map(opt => ({
                            content: opt.content,
                            isCorrect: opt.isCorrect,
                            questionId: questionInstance.id
                        }));
                        await db.QuestionOption.bulkCreate(newOptions, { transaction });
                    }
                }
            }

            await transaction.commit();

            // Return full result
            const updatedQuiz = await db.Quiz.findByPk(id, {
                include: [{
                    model: db.Question,
                    include: [{ model: db.QuestionOption, as: 'options' }]
                }]
            });
            return success(res, updatedQuiz, 'Quiz updated successfully');
        } catch (err) {
            await transaction.rollback();
            return error(res, 'Failed to update quiz', 400, err.message);
        }
    },

    // Update Single Question
    updateQuestion: async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { id } = req.params;
            const { content, mediaUrl, options } = req.body;

            const question = await db.Question.findByPk(id);
            if (!question) {
                await transaction.rollback();
                return error(res, 'Question not found', 404);
            }

            // 1. Update Question details
            await question.update({ content, mediaUrl }, { transaction });

            // 2. Update Options (Replace strategy: Delete all old -> Create new)
            if (options && Array.isArray(options)) {
                // Delete user's existing options for this question
                await db.QuestionOption.destroy({ where: { questionId: id }, transaction });

                if (options.length > 0) {
                    const newOptions = options.map(opt => ({
                        content: opt.content,
                        isCorrect: opt.isCorrect,
                        questionId: id
                    }));
                    await db.QuestionOption.bulkCreate(newOptions, { transaction });
                }
            }

            await transaction.commit();

            // Return updated
            const updatedQuestion = await db.Question.findByPk(id, {
                include: [{ model: db.QuestionOption, as: 'options' }]
            });

            return success(res, updatedQuestion, 'Question updated successfully');
        } catch (err) {
            await transaction.rollback();
            return error(res, 'Failed to update question', 400, err.message);
        }
    },

    // Start Quiz Attempt
    startAttempt: async (req, res) => {
        try {
            const { quizId } = req.body;
            const { id: userId } = req.user; // From verifyToken

            // Fetch all question IDs for this quiz
            const questions = await db.Question.findAll({
                where: { quizId },
                attributes: ['id']
            });
            let questionIds = questions.map(q => q.id);

            // Shuffle questionIds
            const shuffle = (array) => {
                let currentIndex = array.length;
                while (currentIndex != 0) {
                    let randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;
                    [array[currentIndex], array[randomIndex]] = [
                        array[randomIndex],
                        array[currentIndex],
                    ];
                }
                return array;
            };
            const shuffledQuestionIds = shuffle(questionIds);

            const attempt = await db.QuizAttempt.create({
                userId,
                quizId,
                startedAt: new Date(),
                score: 0,
                xpEarned: 0,
                currentIndex: 0,
                questionsOrder: shuffledQuestionIds // Save shuffled order
            });

            return success(res, { attempt, questionIds: shuffledQuestionIds }, 'Attempt started', 201);
        } catch (err) {
            return error(res, 'Failed to start attempt', 400, err.message);
        }
    },

    // Get Attempt (Resume)
    getAttempt: async (req, res) => {
        try {
            const { id } = req.params; // attemptId
            const attempt = await db.QuizAttempt.findByPk(id);

            if (!attempt) return error(res, 'Attempt not found', 404);

            return success(res, {
                attempt,
                questionIds: attempt.questionsOrder || [] // Return saved order
            }, 'Attempt fetched successfully');
        } catch (err) {
            return error(res, 'Failed to fetch attempt', 500, err.message);
        }
    },

    // Submit Single Answer
    submitAnswer: async (req, res) => {
        try {
            const { attemptId, questionId, selectedOptionId } = req.body;

            const attempt = await db.QuizAttempt.findByPk(attemptId);
            if (!attempt) return error(res, 'Attempt not found', 404);

            const option = await db.QuestionOption.findByPk(selectedOptionId);
            if (!option) return error(res, 'Option not found', 404);

            const isCorrect = option.get('isCorrect');

            const detail = await db.AttemptDetail.create({
                attemptId,
                questionId,
                selectedOptionId,
                isCorrect
            });

            // Increment current index
            await attempt.increment('currentIndex');
            await attempt.reload();

            // Check if quiz is finished
            const totalQuestions = await db.Question.count({ where: { quizId: attempt.quizId } });

            let isFinished = false;
            let score = 0;
            let xpEarned = 0;

            if (attempt.currentIndex >= totalQuestions) {
                isFinished = true;

                // Calculate Score
                const details = await db.AttemptDetail.findAll({ where: { attemptId } });
                const correctCount = details.filter(d => d.isCorrect).length;

                score = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 0;


                // Get Quiz for XP reward
                const quiz = await db.Quiz.findByPk(attempt.quizId);

                // Check if user has completed this quiz before
                const previousCompletions = await db.QuizAttempt.count({
                    where: {
                        userId: attempt.userId,
                        quizId: attempt.quizId,
                        finishedAt: { [Op.ne]: null },
                        id: { [Op.ne]: attemptId } // Exclude current attempt
                    }
                });

                const isFirstCompletion = previousCompletions === 0;

                // Only award XP if user got ALL answers correct (perfect score) AND it's first completion
                const isPerfectScore = correctCount === totalQuestions;
                xpEarned = (quiz && isPerfectScore && isFirstCompletion) ? quiz.rewardXp : 0;

                // Update Attempt
                await attempt.update({
                    score,
                    xpEarned,
                    finishedAt: new Date()
                });

                // Update User XP and Level ONLY if this is the first completion
                if (xpEarned > 0) {
                    const user = await db.User.findByPk(attempt.userId);
                    if (user) {
                        const newTotalXp = (user.totalXp || 0) + xpEarned;

                        // Check if user should level up
                        // Find the highest level where minXp <= user's total XP
                        const newLevel = await db.Level.findOne({
                            where: {
                                minXp: { [Op.lte]: newTotalXp }
                            },
                            order: [['level', 'DESC']]
                        });

                        await user.update({
                            totalXp: newTotalXp,
                            level: newLevel ? newLevel.level : user.level
                        });
                    }
                }
            }

            return success(res, {
                isCorrect,
                detail,
                currentIndex: attempt.currentIndex,
                isFinished,
                score: isFinished ? score : undefined,
                xpEarned: isFinished ? xpEarned : undefined
            }, 'Answer submitted');
        } catch (err) {
            return error(res, 'Failed to submit answer', 400, err.message);
        }
    },

    // Get User's Completed Quizzes
    getCompletedQuizzes: async (req, res) => {
        try {
            const { id: userId } = req.user; // From verifyToken

            // Find all completed attempts (where finishedAt is not null)
            const completedAttempts = await db.QuizAttempt.findAll({
                where: {
                    userId,
                    finishedAt: { [Op.ne]: null }
                },
                attributes: ['quizId']
            });

            // Extract unique quiz IDs
            const completedQuizIds = [...new Set(completedAttempts.map(attempt => attempt.quizId))];

            return success(res, { completedQuizIds }, 'Completed quizzes fetched successfully');
        } catch (err) {
            console.error('Error in getCompletedQuizzes:', err);
            return error(res, 'Failed to fetch completed quizzes', 500, err.message);
        }
    },

    // Delete Quiz
    delete: async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { id } = req.params;
            const quiz = await db.Quiz.findByPk(id);
            if (!quiz) {
                await transaction.rollback();
                return error(res, 'Quiz not found', 404);
            }

            // 1. Check if Quiz has been attempted
            const attemptCount = await db.QuizAttempt.count({ where: { quizId: id } });
            if (attemptCount > 0) {
                await transaction.rollback();
                return error(res, 'Cannot delete quiz that has been attempted by users', 400);
            }

            // 2. Delete Questions & Options
            const questions = await db.Question.findAll({ where: { quizId: id }, attributes: ['id'], transaction });
            const questionIds = questions.map(q => q.id);

            if (questionIds.length > 0) {
                await db.QuestionOption.destroy({ where: { questionId: questionIds }, transaction });
                await db.Question.destroy({ where: { id: questionIds }, transaction });
            }

            // 3. Delete Quiz
            await quiz.destroy({ transaction });

            await transaction.commit();
            return success(res, null, 'Quiz deleted successfully');
        } catch (err) {
            await transaction.rollback();
            return error(res, 'Failed to delete quiz', 500, err.message);
        }
    }
};

module.exports = quizController;
