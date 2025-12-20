const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.create);
router.get('/:id', userController.getOne);
router.post('/:id/follow', userController.follow);

module.exports = router;
