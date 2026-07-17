const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { Innertube } = require('youtubei.js'); // Import thư viện InnerTube bypass chất lượng cao
const cloudinary = require('../config/cloudinary');
const Music = require('../models/Music');
const Playlist = require('../models/Playlist');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

// Helper chuẩn hóa URL YouTube để lấy Video ID chính xác
const cleanYoutubeUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/watch?v=${videoId}`;
    }
    if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
            return `https://www.youtube.com/watch?v=${videoId}`;
        }
    }
    return url;
};

// ==========================================
// CÁCH 1: TẢI VỀ FILE TẠM - CHUYỂN ĐỔI - TẢI LÊN CLOUDINARY
// ==========================================
const processYoutubeToCloudinaryAndMongoLocalFile = async (youtubeUrl, playlistId) => {
    return new Promise(async (resolve, reject) => {
        // Tạo thư mục tạm 'temp' ở thư mục gốc của dự án nếu chưa có
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const sanitizedUrl = cleanYoutubeUrl(youtubeUrl);
        const videoId = sanitizedUrl.split('v=')[1];

        // Định nghĩa đường dẫn file tạm cục bộ
        const rawTempPath = path.join(tempDir, `raw_${videoId}`);
        const mp3TempPath = path.join(tempDir, `${videoId}.mp3`);

        // Helper tự động dọn dẹp file tạm sau khi kết thúc (dù thành công hay thất bại)
        const cleanupTempFiles = () => {
            console.log("[CLEANUP] Đang dọn dẹp các file tạm cục bộ...");
            if (fs.existsSync(rawTempPath)) {
                try { fs.unlinkSync(rawTempPath); console.log("  - Đã xóa raw temp file."); } catch (e) { console.error(e); }
            }
            if (fs.existsSync(mp3TempPath)) {
                try { fs.unlinkSync(mp3TempPath); console.log("  - Đã xóa MP3 temp file."); } catch (e) { console.error(e); }
            }
        };

        try {
            console.log("\n[LOCAL-FILE] --- BẮT ĐẦU TIẾN TRÌNH CÁCH 1 (GHI FILE TẠM) ---");

            // BƯỚC 1: Khởi tạo InnerTube Client & Thu thập metadata
            console.log("[LOCAL-FILE] Bước 1: Đang khởi tạo InnerTube Client và lấy metadata...");
            let ytOptions = {};
            try {
                const cookiePath = path.join(__dirname, '../cookies.json'); 
                if (fs.existsSync(cookiePath)) {
                    const cookieData = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
                    ytOptions.cookie = cookieData;
                    console.log("  -> Đã nạp thành công Cookies tài khoản!");
                }
            } catch (cookieErr) {
                console.warn("  [COOKIE WARNING] Không nạp được cookies:", cookieErr.message);
            }

            const yt = await Innertube.create(ytOptions);
            const videoInfo = await yt.getInfo(videoId);

            const title = videoInfo.basic_info?.title || "YouTube Audio Track";
            const durationSec = videoInfo.basic_info?.duration || 240;

            let thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            if (videoInfo.basic_info?.thumbnail && videoInfo.basic_info.thumbnail.length > 0) {
                thumbnail = videoInfo.basic_info.thumbnail[0].url;
            }

            console.log(`[YOUTUBE-INFO] Tiêu đề: ${title}`);
            console.log(`[YOUTUBE-INFO] Thời lượng: ${durationSec} giây`);

            // BƯỚC 2: Tải luồng âm thanh gốc về lưu thành file tạm cục bộ
            console.log("[LOCAL-FILE] Bước 2: Đang tải luồng âm thanh thô về ổ cứng...");
            const nodeReadableStream = await videoInfo.download({
                type: 'audio',
                quality: 'best',
                client: 'ANDROID_VR'
            });

            // Ghi luồng dữ liệu vào file thô trên đĩa cứng
            await new Promise((res, rej) => {
                const writeStream = fs.createWriteStream(rawTempPath);
                nodeReadableStream.pipe(writeStream);
                nodeReadableStream.on('end', () => res());
                nodeReadableStream.on('error', (err) => rej(err));
                writeStream.on('error', (err) => rej(err));
            });
            console.log("  -> Ghi file thô hoàn tất!");

            // BƯỚC 3: Sử dụng FFmpeg convert từ file thô sang file .mp3 tạm thời
            console.log("[LOCAL-FILE] Bước 3: Chạy FFmpeg convert sang MP3...");
            await new Promise((res, rej) => {
                ffmpeg(rawTempPath)
                    .toFormat('mp3')
                    .audioBitrate(128)
                    .on('end', () => {
                        console.log("  -> Chuyển mã sang MP3 thành công!");
                        res();
                    })
                    .on('error', (ffmpegErr) => {
                        console.error("[FFMPEG ERROR] Thất bại khi convert:", ffmpegErr.message);
                        rej(ffmpegErr);
                    })
                    .save(mp3TempPath);
            });

            // BƯỚC 4: Upload file .mp3 đã hoàn chỉnh lên Cloudinary
            console.log("[LOCAL-FILE] Bước 4: Đang tải file MP3 lên Cloudinary...");
            const cloudinaryResult = await cloudinary.uploader.upload(mp3TempPath, {
                folder: 'youtube_mp3_tracks',
                resource_type: 'video', // Cloudinary quản lý file âm thanh dưới dạng 'video'
                format: 'mp3'
            });
            console.log("  -> Upload Cloudinary thành công!");

            // BƯỚC 5: Lưu thông tin bản ghi vào Database
            console.log("[LOCAL-FILE] Bước 5: Đang lưu vào Database...");
            const minutes = Math.floor(durationSec / 60);
            const seconds = durationSec % 60;
            const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            const newMusic = new Music({
                title: title,
                youtubeUrl: sanitizedUrl,
                duration: formattedDuration,
                thumbnail: thumbnail,
                cloudinaryUrl: cloudinaryResult.secure_url,
                cloudinaryPublicId: cloudinaryResult.public_id
            });

            const savedMusic = await newMusic.save();
            console.log(`[DATABASE] Đã lưu nhạc thành công. ID: ${savedMusic._id}`);

            if (playlistId) {
                console.log(`[DATABASE] Gán bài hát mới vào Playlist ID: ${playlistId}`);
                await Playlist.findByIdAndUpdate(
                    playlistId,
                    { $push: { tracks: savedMusic._id } }
                );
            }

            console.log("[LOCAL-FILE] --- HOÀN THÀNH TOÀN BỘ QUY TRÌNH (CÁCH 1) ---");
            cleanupTempFiles();
            resolve(savedMusic);

        } catch (error) {
            console.error("[LOCAL-FILE FATAL ERROR] Lỗi hệ thống:", error.message);
            cleanupTempFiles();
            reject(error);
        }
    });
};

// ==========================================
// 2. API DOWNLOAD & SAVE
// ==========================================
const handleDownloadAndSave = async (req, res) => {
    console.log(`\n[API POST /api/music] Nhận yêu cầu tải nhạc!`);
    try {
        const { url, playlistId } = req.body;
        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp link YouTube hợp lệ!"
            });
        }
        const sanitizedUrl = cleanYoutubeUrl(url);

        // Gọi Hàm xử lý Cách 1 (File tạm cục bộ)
        const result = await processYoutubeToCloudinaryAndMongoLocalFile(sanitizedUrl, playlistId);

        return res.status(201).json({
            success: true,
            message: playlistId
                ? "Tải nhạc và gán tự động vào Playlist thành công!"
                : "Tải nhạc thành công!",
            data: result
        });

    } catch (error) {
        console.error(`[API ERROR 500] Thất bại tại handleDownloadAndSave:`, error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Có lỗi xảy ra trong quá trình xử lý hệ thống!",
        });
    }
};

// ==========================================
// 3. API GET ALL MUSIC
// ==========================================
const getAllMusic = async (req, res) => {
    try {
        const musicList = await Music.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data: musicList
        });
    } catch (error) {
        console.error("[API ERROR] Lỗi lấy danh sách nhạc:", error.message);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi lấy danh sách nhạc!"
        });
    }
};

// ==========================================
// 4. API DELETE MUSIC
// ==========================================
const deleteMusic = async (req, res) => {
    const { id } = req.params;
    try {
        const musicItem = await Music.findById(id);
        if (!musicItem) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài hát để xóa!"
            });
        }

        if (musicItem.cloudinaryPublicId) {
            await new Promise((resolve) => {
                cloudinary.uploader.destroy(
                    musicItem.cloudinaryPublicId,
                    { resource_type: 'video' },
                    () => resolve()
                );
            });
        }

        await Playlist.updateMany(
            { tracks: id },
            { $pull: { tracks: id } }
        );

        await Music.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Xóa bài hát thành công!"
        });

    } catch (error) {
        console.error(`[API ERROR] Thất bại tại deleteMusic:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi xóa bài hát!"
        });
    }
};

module.exports = { handleDownloadAndSave, getAllMusic, deleteMusic };