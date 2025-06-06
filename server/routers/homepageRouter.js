const express = require('express');
const upload = require('../middleware/homepageMiddle');
const { getHomePage, createHomepage, updateHomepage, deleteElement } = require('../controllers/homepageController')

const router = express.Router();

router.get('/', getHomePage);
router.post('/', upload.single('image'), createHomepage);
//test
// router.post('/', upload.single('image'), 
// (req, res, next) => {
//   console.log('==== Debug Multer ====');
//   console.log('req.headers:', req.headers);
//   console.log('req.body:', req.body);
//   console.log('req.file:', req.file);
//   console.log('req.files:', req.files);
//   next();
// }, createHomepage);
router.put('/:id', upload.single('image'), updateHomepage);
router.delete('/:id', deleteElement);

module.exports = router;






