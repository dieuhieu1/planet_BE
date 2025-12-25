const express = require('express');
const router = express.Router();
const levelController = require('../controllers/levelController');

/**
 * @swagger
 * tags:
 *   name: Level
 *   description: Level/Rank management
 */

/**
 * @swagger
 * /levels:
 *   get:
 *     summary: Get all levels
 *     tags: [Level]
 *     responses:
 *       200:
 *         description: List of all levels
 */
router.get('/', levelController.getAll);

module.exports = router;
