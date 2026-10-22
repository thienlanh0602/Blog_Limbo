const mongoose = require('mongoose');
const Folder = require('../models/Folder');
const File = require('../models/File');
const { cloudinary } = require('../config/cloudinary');

const forbidden = (res) =>
    res.status(403).json({ message: 'Không có quyền truy cập' });

// ---------- HÀM PHỤ ----------

// Đổi byte -> "12 MB" (khớp với giao diện: mặc định "0 MB")
const formatSize = (bytes = 0) => {
    if (!bytes) return '0 MB';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** i;
    return `${value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
};

// Cloudinary phân loại tài nguyên: image (gồm PDF) | video (gồm audio) | raw (docx, xlsx, zip...)
// Xóa phải truyền đúng loại, nếu không Cloudinary trả "not found" và file vẫn nằm lại trên cloud.
const resourceTypeOf = (mime = '') => {
    if (mime.startsWith('image/') || mime === 'application/pdf') return 'image';
    if (mime.startsWith('video/') || mime.startsWith('audio/')) return 'video';
    return 'raw';
};

const destroyOnCloudinary = (file) =>
    cloudinary.uploader.destroy(file.cloudinaryPublicId, {
        resource_type: resourceTypeOf(file.fileType),
        invalidate: true
    });

// multer đọc tên file theo latin1 nên tiếng Việt bị lỗi font -> đổi lại sang utf8
const fixFileName = (name = '') => Buffer.from(name, 'latin1').toString('utf8');

// folderId có nằm trong (hoặc chính là) thư mục được chia sẻ hay không
const isInsideRoot = async (folderId, rootId) => {
    let current = await Folder.findById(folderId).select('_id parentFolder');
    for (let depth = 0; current && depth < 50; depth++) {
        if (String(current._id) === String(rootId)) return true;
        if (!current.parentFolder) return false;
        current = await Folder.findById(current.parentFolder).select('_id parentFolder');
    }
    return false;
};

// Gắn fileCount + storeSize (tính cả thư mục con bên trong) cho từng folder
const withStats = async (folders) => {
    if (folders.length === 0) return folders;

    const [allFolders, fileStats] = await Promise.all([
        Folder.find().select('_id parentFolder').lean(),
        File.aggregate([{ $group: { _id: '$folder', count: { $sum: 1 }, size: { $sum: '$size' } } }])
    ]);

    const childrenOf = new Map();
    allFolders.forEach((f) => {
        const key = String(f.parentFolder);
        if (!childrenOf.has(key)) childrenOf.set(key, []);
        childrenOf.get(key).push(String(f._id));
    });
    const ownStats = new Map(fileStats.map((s) => [String(s._id), s]));

    const totalOf = (folderId) => {
        let count = 0;
        let size = 0;
        const stack = [String(folderId)];
        while (stack.length) {
            const id = stack.pop();
            const s = ownStats.get(id);
            if (s) { count += s.count; size += s.size; }
            (childrenOf.get(id) || []).forEach((c) => stack.push(c));
        }
        return { count, size };
    };

    return folders.map((f) => {
        const { count, size } = totalOf(f._id);
        return { ...f, fileCount: count, storeSize: formatSize(size) };
    });
};

// 1. LẤY DANH SÁCH FOLDER & FILE
const getContents = async (req, res) => {
    try {
        const { folderId } = req.query;
        const shareToken = req.query.shareToken || req.headers['x-share-token'];

        // Chặn giá trị lạ (vd: ?shareToken[$ne]=x gây NoSQL injection)
        if (shareToken && typeof shareToken !== 'string') return forbidden(res);
        if (folderId && !mongoose.isValidObjectId(folderId)) {
            return res.status(400).json({ message: 'folderId không hợp lệ' });
        }

        // CASE 1: Có link chia sẻ -> CHỈ thấy trong thư mục được chia sẻ
        // (kiểm tra trước quyền admin để admin mở link cũng thấy đúng giao diện người xem)
        if (shareToken) {
            const root = await Folder.findOne({ shareToken });
            if (!root) return forbidden(res);

            // Không có folderId = "gốc" của link = chính thư mục được chia sẻ
            const targetId = folderId || root._id;
            if (!(await isInsideRoot(targetId, root._id))) return forbidden(res);

            const [folders, files] = await Promise.all([
                Folder.find({ parentFolder: targetId }).select('-shareToken').lean(),
                File.find({ folder: targetId }).select('-cloudinaryPublicId').lean()
            ]);

            return res.json({
                role: 'VIEWER',
                shareRoot: { _id: root._id, name: root.name },
                folders: await withStats(folders),
                files
            });
        }

        // CASE 2: Admin đã đăng nhập -> xem toàn bộ
        if (req.role !== 'ADMIN') return forbidden(res);

        const parentFolderId = folderId || null;
        const [folders, files] = await Promise.all([
            Folder.find({ parentFolder: parentFolderId }).select('-shareToken').lean(),
            File.find({ folder: parentFolderId }).sort({ createdAt: -1 }).lean()
        ]);

        return res.json({
            role: 'ADMIN',
            folders: await withStats(folders),
            files
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 2. TẠO THƯ MỤC MỚI (CHỈ ADMIN)
const createFolder = async (req, res) => {
    try {
        const { name, parentFolder } = req.body;
        const newFolder = new Folder({ name, parentFolder: parentFolder || null });
        await newFolder.save();
        res.status(201).json(newFolder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 3. UPLOAD FILE VÀO CLOUDINARY & LƯU MONGO (CHỈ ADMIN)
const uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Vui lòng chọn file' });

        const folderId = req.body.folderId || null;
        if (folderId) {
            // File đã lên Cloudinary rồi mà folder không hợp lệ -> dọn luôn để khỏi rác
            const valid = mongoose.isValidObjectId(folderId) && (await Folder.exists({ _id: folderId }));
            if (!valid) {
                await cloudinary.uploader
                    .destroy(req.file.filename, { resource_type: resourceTypeOf(req.file.mimetype) })
                    .catch(() => {});
                return res.status(400).json({ message: 'Thư mục đích không tồn tại' });
            }
        }

        const newFile = new File({
            name: fixFileName(req.file.originalname),
            folder: folderId,
            cloudinaryPublicId: req.file.filename,
            url: req.file.path,
            fileType: req.file.mimetype,
            size: req.file.size
        });

        await newFile.save();
        res.status(201).json(newFile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 4. TẠO LINK CHIA SẺ CHO FOLDER (CHỈ ADMIN)
const shareFolder = async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.id);
        if (!folder) return res.status(404).json({ message: 'Không tìm thấy folder' });

        if (!folder.shareToken) {
            folder.generateShareToken();
            await folder.save();
        }

        res.json({ shareToken: folder.shareToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. XÓA FILE (CHỈ ADMIN)
const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File không tồn tại' });

        // Xóa trên Cloudinary (đúng resource_type). Lỗi cloud không chặn việc xóa trong DB.
        try {
            await destroyOnCloudinary(file);
        } catch (e) {
            console.error('Cloudinary destroy lỗi:', e.message);
        }
        await file.deleteOne();

        res.json({ message: 'Đã xóa file thành công' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 6. XÓA FOLDER + TOÀN BỘ THƯ MỤC CON + FILE BÊN TRONG (CHỈ ADMIN)
const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'id không hợp lệ' });
        }

        const root = await Folder.findById(id).select('_id');
        if (!root) return res.status(404).json({ message: 'Thư mục không tồn tại' });

        // Gom id của folder này và mọi folder con cháu
        const folderIds = [root._id];
        let frontier = [root._id];
        for (let depth = 0; frontier.length && depth < 50; depth++) {
            const children = await Folder.find({ parentFolder: { $in: frontier } }).select('_id').lean();
            frontier = children.map((c) => c._id);
            folderIds.push(...frontier);
        }

        // Xóa file trên Cloudinary rồi xóa trong DB
        const files = await File.find({ folder: { $in: folderIds } }).lean();
        const results = await Promise.allSettled(files.map(destroyOnCloudinary));
        results.forEach((r, i) => {
            if (r.status === 'rejected') {
                console.error(`Cloudinary destroy lỗi (${files[i].name}):`, r.reason?.message);
            }
        });

        await File.deleteMany({ folder: { $in: folderIds } });
        await Folder.deleteMany({ _id: { $in: folderIds } });

        res.json({
            message: 'Đã xóa thư mục thành công',
            deletedFolders: folderIds.length,
            deletedFiles: files.length
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getContents,
    createFolder,
    uploadFile,
    shareFolder,
    deleteFile,
    deleteFolder
};