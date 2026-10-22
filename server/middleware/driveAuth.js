const Folder = require('../models/Folder');
const jwt = require('jsonwebtoken');

const checkDriveAccess = async (req, res, next) => {
  try {
    // 1. Kiểm tra Admin qua Authorization Header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // VÌ BLOG CỦA BẠN CHỈ CÓ ADMIN ĐĂNG NHẬP, MIỄN CÓ TOKEN HỢP LỆ LÀ ADMIN!
        if (decoded && (decoded.id || decoded.username)) {
          req.role = 'ADMIN';
          return next();
        }
      } catch (err) {
        // Token hết hạn hoặc không hợp lệ thì bỏ qua, xuống check Share Token
      }
    }

    // 2. Kiểm tra Share Token của Folder (dành cho người có link chia sẻ)
    const shareToken = req.query.shareToken || req.body.shareToken;
    if (shareToken) {
      const folder = await Folder.findOne({ shareToken });
      if (folder) {
        req.role = 'VIEWER';
        req.sharedFolder = folder;
        return next();
      }
    }

    // 3. Không có quyền
    return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
};

// Middleware bắt buộc phải là Admin
const requireAdmin = (req, res, next) => {
  if (req.role === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này' });
};

module.exports = { checkDriveAccess, requireAdmin };