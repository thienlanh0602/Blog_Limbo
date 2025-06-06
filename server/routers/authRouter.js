const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/authMiddleware');
const { creactAdmin, login, getlogin } = require('../controllers/authController');

dotenv.config();

//tao user
router.post('/create', creactAdmin)

// Lấy dữ liệu đăng nhập
router.post('/login', login);

//Lấy tên admin ra để xin chào thôi 
router.get('/admin', authenticateAdmin, getlogin);
module.exports = router;







