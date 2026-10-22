const mongoose = require('mongoose');
const crypto = require('crypto');

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  parentFolder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Folder', 
    default: null // null nghĩa là thư mục gốc (Root)
  },
  // Token dùng để tạo đường dẫn chia sẻ folder cho người xem công khai
  shareToken: { type: String, unique: true, sparse: true },
  isPublic: { type: Boolean, default: false }
}, { timestamps: true });

// Hàm helper để tạo share token ngẫu nhiên khi bật chia sẻ
folderSchema.methods.generateShareToken = function() {
  this.shareToken = crypto.randomBytes(16).toString('hex');
  this.isPublic = true;
  return this.shareToken;
};

module.exports = mongoose.model('Folder', folderSchema);