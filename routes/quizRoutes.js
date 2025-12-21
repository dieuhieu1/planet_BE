const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const verifyToken = require('../middlewares/verifyToken');

/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: Quiz management
 */

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - planetId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Solar System Quiz"
 *               description:
 *                 type: string
 *                 example: "Test your knowledge about planets"
 *               planetId:
 *                 type: integer
 *                 example: 1
 *               rewardXp:
 *                 type: integer
 *                 example: 50
 *               minLevel:
 *                 type: integer
 *                 example: 1
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - content
 *                     - options
 *                   properties:
 *                     content:
 *                       type: string
 *                       example: "What is the largest planet?"
 *                     mediaUrl:
 *                       type: string
 *                       example: "http://example.com/jupiter.jpg"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - content
 *                           - isCorrect
 *                         properties:
 *                           content:
 *                             type: string
 *                             example: "Jupiter"
 *                           isCorrect:
 *                             type: boolean
 *                             example: true
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', quizController.create);

/**
 * @swagger
 * /quizzes/planet/{planetId}:
 *   get:
 *     summary: Get quizzes by planet
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: planetId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Planet ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of quizzes (Paginated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         totalItems:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         currentPage:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 */
router.get('/planet/:planetId', quizController.getByPlanet);

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     summary: Get quiz by ID
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz details
 *       404:
 *         description: Quiz not found
 */
router.get('/:id', quizController.getOne);

/**
 * @swagger
 * /quizzes/{id}:
 *   put:
 *     summary: "Update quiz (Validation: Full Sync of Questions)"
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               planetId:
 *                 type: integer
 *               rewardXp:
 *                 type: integer
 *               minLevel:
 *                 type: integer
 *               questions:
 *                 type: array
 *                 description: "Full list of questions. Missing IDs will be deleted."
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: "If provided, updates existing. If null, creates new."
 *                     content:
 *                       type: string
 *                     mediaUrl:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           content:
 *                             type: string
 *                           isCorrect:
 *                             type: boolean
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 */
router.put('/:id', verifyToken, quizController.update);

/**
 * @swagger
 * /quizzes/{id}:
 *   delete:
 *     summary: Delete quiz
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 */
router.delete('/:id', verifyToken, quizController.delete);

/**
 * @swagger
 * /quizzes/attempt/{id}:
 *   get:
 *     summary: Get attempt details (Resume quiz)
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attempt ID
 *     responses:
 *       200:
 *         description: Attempt details with question order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     attempt:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 10
 *                         currentIndex:
 *                           type: integer
 *                           example: 3
 *                         score:
 *                           type: number
 *                           example: 0
 *                     questionIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [102, 105, 101, 103]
 */
router.get('/attempt/:id', verifyToken, quizController.getAttempt);

/**
 * @swagger
 * /quizzes/start:
 *   post:
 *     summary: Start a quiz attempt
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quizId
 *             properties:
 *               quizId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Attempt started (returns attempt info and list of questionIds)
 */
router.post('/start', verifyToken, quizController.startAttempt);



/**
 * @swagger
 * /quizzes/answer:
 *   post:
 *     summary: Submit a single answer
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attemptId
 *               - questionId
 *               - selectedOptionId
 *             properties:
 *               attemptId:
 *                 type: integer
 *                 example: 1
 *               questionId:
 *                 type: integer
 *                 example: 1
 *               selectedOptionId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Answer submitted
 */
router.post('/answer', verifyToken, quizController.submitAnswer);



/**
 * @swagger
 * /quizzes/attempt:


/**
 * @swagger
 * /quizzes/{id}/questions:
 *   post:
 *     summary: Add a question to a quiz
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questions
 *             properties:
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - content
 *                     - options
 *                   properties:
 *                     content:
 *                       type: string
 *                       example: "Question 1?"
 *                     mediaUrl:
 *                       type: string
 *                       example: "http://example.com/img1.jpg"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - content
 *                           - isCorrect
 *                         properties:
 *                           content:
 *                             type: string
 *                             example: "Option A"
 *                           isCorrect:
 *                             type: boolean
 *                             example: true
 *           example:
 *             questions:
 *               - content: "Which is the largest planet?"
 *                 mediaUrl: "http://example.com/jupiter.jpg"
 *                 options:
 *                   - content: "Jupiter"
 *                     isCorrect: true
 *                   - content: "Saturn"
 *                     isCorrect: false
 *                   - content: "Earth"
 *                     isCorrect: false
 *                   - content: "Mars"
 *                     isCorrect: false
 *     responses:
 *       201:
 *         description: Questions added successfully
 *       404:
 *         description: Quiz not found
 */
router.post('/:id/questions', quizController.addQuestion);

module.exports = router;
