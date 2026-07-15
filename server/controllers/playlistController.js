const Playlist = require('../models/Playlist');
const cloudinary = require('../config/cloudinary'); // Import cấu hình cloudinary để xử lý xóa ảnh

// Hàm tiện ích để trích xuất Public ID từ URL Cloudinary nhằm mục đích xóa ảnh
const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    try {
        // Ví dụ: https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/image_name.jpg
        const parts = url.split('/upload/');
        if (parts.length < 2) return null;
        
        // Bỏ phần version (v1234567/) đi và lấy chuỗi phía sau
        const publicIdWithFormat = parts[1].replace(/^v\d+\//, ''); 
        
        // Cắt bỏ phần mở rộng đuôi file (.jpg, .png...)
        return publicIdWithFormat.substring(0, publicIdWithFormat.lastIndexOf('.'));
    } catch (error) {
        console.error("Lỗi trích xuất Public ID:", error);
        return null;
    }
};

// 1. Lấy toàn bộ danh sách Playlist
const getAllPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: playlists });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Lấy chi tiết 1 Playlist kèm danh sách bài hát
const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;
        const playlist = await Playlist.findById(id).populate('tracks');
        if (!playlist) {
            return res.status(404).json({ success: false, message: "Không tìm thấy playlist!" });
        }
        return res.status(200).json({ success: true, data: playlist });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Tạo mới một Playlist (Hỗ trợ upload ảnh lên Cloudinary và trường description)
const createPlaylist = async (req, res) => {
    try {
        // Lấy thêm trường description từ req.body
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "Tên playlist không được để trống!" });
        }

        // Nếu người dùng tải ảnh lên, lấy URL từ req.file.path. Nếu không, xài ảnh mặc định
        const thumbnail = req.file ? req.file.path : 'https://via.placeholder.com/300x300?text=No+Playlist+Image';

        // Đưa description vào khởi tạo model
        const newPlaylist = new Playlist({ 
            name, 
            description: description || '', 
            thumbnail 
        });
        await newPlaylist.save();

        return res.status(201).json({
            success: true,
            message: "Tạo playlist thành công!",
            data: newPlaylist
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Không thể tạo playlist: " + error.message });
    }
};

// 4. Cập nhật tên, mô tả hoặc hình ảnh của Playlist (Tự động xóa ảnh cũ trên Cloudinary)
const updatePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        // Thêm description nhận vào từ client gửi lên
        const { name, description } = req.body;

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ success: false, message: "Không tìm thấy playlist để cập nhật!" });
        }

        // Chuẩn bị dữ liệu cập nhật (nếu trường nào không truyền lên thì giữ lại giá trị cũ của document trong DB)
        let updateData = { 
            name: name !== undefined ? name : playlist.name,
            description: description !== undefined ? description : playlist.description
        };

        // Nếu người dùng chọn upload FILE ẢNH MỚI
        if (req.file) {
            updateData.thumbnail = req.file.path;

            // Tiến hành xóa ảnh cũ trên Cloudinary nếu nó không phải là ảnh mặc định placeholder
            if (playlist.thumbnail && !playlist.thumbnail.includes('placeholder')) {
                const oldPublicId = getPublicIdFromUrl(playlist.thumbnail);
                if (oldPublicId) {
                    await cloudinary.uploader.destroy(oldPublicId).catch(err => console.error("Lỗi xóa ảnh cũ trên Cloudinary:", err));
                }
            }
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        return res.status(200).json({
            success: true,
            message: "Cập nhật playlist thành công!",
            data: updatedPlaylist
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi cập nhật: " + error.message });
    }
};

// 5. Xóa Playlist hoàn toàn (Tự động xóa luôn ảnh bìa trên Cloudinary)
const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const playlist = await Playlist.findById(id);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Không tìm thấy playlist để xóa!" });
        }

        // Xóa hình ảnh trên Cloudinary trước khi xóa tài liệu trong DB
        if (playlist.thumbnail && !playlist.thumbnail.includes('placeholder')) {
            const publicId = getPublicIdFromUrl(playlist.thumbnail);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId).catch(err => console.error("Lỗi xóa ảnh playlist trên Cloudinary:", err));
            }
        }

        await Playlist.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Xóa playlist và hình ảnh thành công!"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi khi xóa playlist: " + error.message });
    }
};

module.exports = {
    getAllPlaylists,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    deletePlaylist
};