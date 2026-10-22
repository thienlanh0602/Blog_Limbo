// const dotenv = require('dotenv');
// dotenv.config();
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// module.exports = cloudinary;



const dotenv = require('dotenv');
dotenv.config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình tài khoản Cloudinary của bạn
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình Cloudinary Storage cho Multer (hỗ trợ mọi định dạng file: ảnh, video, pdf, docx, zip...)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'blog_limbo_drive', // Tên thư mục trên Cloudinary của bạn
            resource_type: 'auto',      // Quan trọng: Tự động nhận diện loại file (image, video, raw)
            public_id: `${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, "")}` // Đặt tên file tránh trùng lặp
        };
    },
});

const uploadCloud = multer({ storage });

module.exports = { cloudinary, uploadCloud };