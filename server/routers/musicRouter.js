const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');

router.post('/', musicController.handleDownloadAndSave);
router.get('/', musicController.getAllMusic);
router.delete('/:id', musicController.deleteMusic);

module.exports = router;