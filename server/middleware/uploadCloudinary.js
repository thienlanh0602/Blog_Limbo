const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const createUploadMiddleware = (folderName) => {
    const storage = new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => {
            return {
                folder: folderName,
                resource_type: 'auto',
            };
        },
    });

    return multer({ storage });
};

module.exports = createUploadMiddleware;