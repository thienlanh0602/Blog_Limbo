const Image = require('../models/Image')
const cloudinary = require('../config/cloudinary')

// lấy danh sách ảnh
const getImages = async (req, res) => {
    try {
        const images = await Image.find().sort({ order: 1, createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy danh sách ảnh ❌' });
    }
};

// tạo ảnh mới
const createImage = async (req, res) => {
    try {
        const { title, description, category, order } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Vui lòng chọn ảnh để tải lên' });
        }

        const newImage = new Image({
            title,
            description,
            category,
            order: order || 0,
            image: req.file.path,
            public_id: req.file.filename,
        });

        await newImage.save();
        return res.status(201).json(newImage);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Không thể tạo ảnh ❌' });
    }
};

// cập nhật thông tin ảnh (đổi title/description/category, hoặc thay ảnh mới)
const updateImage = async (req, res) => {
    try {
        const { title, description, category, order } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (order !== undefined) updateData.order = order;

        // nếu người dùng thay ảnh mới, xoá ảnh cũ trên Cloudinary trước
        if (req.file) {
            const oldImage = await Image.findById(req.params.id);
            if (oldImage?.public_id) {
                try {
                    await cloudinary.uploader.destroy(oldImage.public_id);
                } catch (err) {
                    console.log('Không thể xoá ảnh cũ trên Cloudinary:', err.message);
                }
            }
            updateData.image = req.file.path;
            updateData.public_id = req.file.filename;
        }

        const updated = await Image.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updated) {
            return res.status(404).json({ message: 'Không tìm thấy ảnh để cập nhật' });
        }

        res.json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Không thể cập nhật ảnh ❌' });
    }
};

// xoá ảnh
const deleteImage = async (req, res) => {
    try {
        const del = await Image.findById(req.params.id);
        if (!del) {
            return res.status(404).json({ message: 'Không tìm thấy ảnh để xoá' });
        }

        if (del.public_id) {
            try {
                await cloudinary.uploader.destroy(del.public_id);
            } catch (err) {
                console.log('Không thể xoá ảnh trên Cloudinary:', err.message);
            }
        }

        await Image.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Đã xoá thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xoá ảnh' });
    }
};

module.exports = { getImages, createImage, updateImage, deleteImage };