const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  // File upload thật thì bắt buộc có id Cloudinary; file tạo từ link Google (isExternal) thì không có
  cloudinaryPublicId: {
    type: String,
    required: function () { return !this.isExternal; }
  },
  url: { type: String, required: true }, // Đường dẫn xem/tải từ Cloudinary, hoặc link gốc nếu là link Google
  fileType: { type: String }, // image, pdf, video, raw (doc, zip, v.v.); với link Google là mime application/vnd.google-apps.*
  extension: { type: String }, // .pdf, .docx, .png,...
  size: { type: Number }, // Kích thước tính bằng Byte (link Google = 0)

  // ---- Tệp thêm từ link Google Docs / Sheets / Slides / Forms / Drive ----
  isExternal: { type: Boolean, default: false },
  previewUrl: { type: String, default: '' }, // link nhúng iframe để xem thử
  externalType: { type: String, default: '' }, // gdoc | gsheet | gslide | gform | gdrive
  externalId: { type: String, default: '' } // id tài liệu trên Google
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);