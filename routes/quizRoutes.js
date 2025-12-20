const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/', quizController.create);
router.get('/planet/:planetId', quizController.getByPlanet);
router.get('/:id', quizController.getOne);
router.post('/attempt', quizController.submitAttempt);

module.exports = router;
