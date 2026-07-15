const express = require('express');
const createUploadMiddleware = require('../middleware/uploadCloudinary');
const { getImages, createImage, updateImage, deleteImage } = require('../controllers/imageController');

const router = express.Router();

const upload = createUploadMiddleware('Image');

const handleUpload = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.log('=== IMAGE UPLOAD ERROR ===');
            console.log(err.message || err);
            console.log('===========================');
            return res.status(400).json({ error: 'Lỗi upload ảnh', detail: err.message || err });
        }
        next();
    });
};

// get
router.get('/', getImages);
// create
router.post('/', handleUpload, createImage);
// update
router.put('/:id', handleUpload, updateImage);
// delete
router.delete('/:id', deleteImage);

module.exports = router;