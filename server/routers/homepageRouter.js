const express = require('express');
const upload = require('../middleware/homepageMiddle');
const { getHomePage, createHomepage, updateHomepage, deleteElement } = require('../controllers/homepageController')

const router = express.Router();

// get
router.get('/', getHomePage);
// create
router.post('/', upload.array('image'), createHomepage);
// update
router.put('/:id', upload.array('image', 5), updateHomepage);

router.delete('/:id', deleteElement);

module.exports = router;






