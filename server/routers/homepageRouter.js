const express = require('express');
const { getHomePage, createHomepage, updateHomepage, deleteElement } = require('../controllers/homepageController');
const createUploadMiddleware = require('../middleware/uploadCloudinary');
const upload = createUploadMiddleware('Homepage');

const router = express.Router();
// middleware bắt lỗi từ multer/cloudinary khi upload file
const handleUpload = (fieldName, maxCount) => {
    return (req, res, next) => {
        const middleware = maxCount ? upload.array(fieldName, maxCount) : upload.array(fieldName);
        middleware(req, res, (err) => {
            if (err) {
                console.log('=== UPLOAD ERROR DEBUG ===');
                console.log('typeof err:', typeof err);
                console.log('err instanceof Error:', err instanceof Error);
                console.log('err keys:', Object.keys(err));
                console.log('err.message:', err.message);
                console.log('err.http_code:', err.http_code);
                console.log('err.name:', err.name);
                console.log('Raw err:', err);
                console.log('==========================');
                return res.status(400).json({ error: 'Lỗi upload ảnh', detail: err.message || err });
            }
            next();
        });
    };
};

// get
router.get('/', getHomePage);
// create
router.post('/', handleUpload('image'), createHomepage);
// update
router.put('/:id', handleUpload('image', 5), updateHomepage);

router.delete('/:id', deleteElement);

module.exports = router;