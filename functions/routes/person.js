const express = require('express');

const PersonController = require('../controllers/person'); 

const router = express.Router();

router.get('', PersonController.searchPerson);
router.get('/:id', PersonController.getPerson);

module.exports = router;