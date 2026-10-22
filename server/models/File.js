const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  folder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Folder', 
    default: null 
  },
  cloudinaryPublicId: { type: String, required: true },
  url: { type: String, required: true }, // Đường dẫn xem/tải từ Cloudinary
  fileType: { type: String }, // image, pdf, video, raw (doc, zip, v.v.)
  extension: { type: String }, // .pdf, .docx, .png,...
  size: { type: Number } // Kích thước tính bằng Byte
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);