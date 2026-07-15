const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: String, // ví dụ: 'landscape', 'portrait', 'diy'... tuỳ bạn phân loại
    required: false,
  },
  image: {
    type: String, // URL ảnh trên Cloudinary
    required: true,
  },
  public_id: {
    type: String, // lưu riêng public_id để xoá ảnh trên Cloudinary chính xác, không cần tách từ URL
    required: false,
  },
  order: {
    type: Number, // dùng để sắp xếp thứ tự hiển thị nếu cần kéo-thả sắp xếp
    default: 0,
  },
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;