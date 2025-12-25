const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

/**
 * @swagger
 * tags:
 *   name: Question
 *   description: Question management
 */

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Get question details by ID
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question details with options
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
 *                     id:
 *                       type: integer
 *                     content:
 *                       type: string
 *                     options:
 *                       type: array
 *       404:
 *         description: Question not found
 */
router.get('/:id', quizController.getQuestion);

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Update a question
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated Question Content?"
 *               mediaUrl:
 *                 type: string
 *                 example: "http://example.com/new_img.jpg"
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - content
 *                     - isCorrect
 *                   properties:
 *                     content:
 *                       type: string
 *                       example: "Updated Option A"
 *                     isCorrect:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       200:
 *         description: Question updated successfully
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
 *                   example: "Question updated successfully"
 *       404:
 *         description: Question not found
 */
router.put('/:id', quizController.updateQuestion);

module.exports = router;
