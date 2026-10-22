const express = require('express');
const router = express.Router();
const { checkDriveAccess, requireAdmin } = require('../middleware/driveAuth');
const { uploadCloud } = require('../config/cloudinary');
const {
    getContents,
    createFolder,
    uploadFile,
    shareFolder,
    deleteFile,
    deleteFolder
} = require('../controllers/driveController');

// 1. LẤY DANH SÁCH FOLDER & FILE
router.get('/contents', checkDriveAccess, getContents);

// 2. TẠO THƯ MỤC MỚI (CHỈ ADMIN)
router.post('/folder', checkDriveAccess, requireAdmin, createFolder);

// 3. UPLOAD FILE (CHỈ ADMIN)
router.post('/upload', checkDriveAccess, requireAdmin, uploadCloud.single('file'), uploadFile);

// 4. TẠO SHARE LINK CHO FOLDER (CHỈ ADMIN)
router.post('/folder/:id/share', checkDriveAccess, requireAdmin, shareFolder);

// 5. XÓA FILE (CHỈ ADMIN)
router.delete('/file/:id', checkDriveAccess, requireAdmin, deleteFile);

// 5. XÓA FOLDER VÀ XÓA LUÔN FILE BÊN TRONG (CHỈ ADMIN)
router.delete('/folder/:id', checkDriveAccess, requireAdmin, deleteFolder);

module.exports = router;