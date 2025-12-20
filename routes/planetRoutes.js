const express = require('express');
const router = express.Router();
const planetController = require('../controllers/planetController');

router.get('/', planetController.getAll);
router.get('/:id', planetController.getOne);
router.post('/', planetController.create);
router.put('/:id', planetController.update);
router.delete('/:id', planetController.delete);

module.exports = router;
