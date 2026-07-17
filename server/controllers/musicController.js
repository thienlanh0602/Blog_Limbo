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
// 1. TIẾN TRÌNH STREAM QUA FFMPEG LÊN CLOUDINARY
// ==========================================
const processYoutubeToCloudinaryAndMongoStream = async (youtubeUrl, playlistId) => {
    return new Promise(async (resolve, reject) => {
        let ffmpegCommand = null;
        let isFinished = false;

        const cleanup = () => {
            console.log("[CLEANUP] Đang tiến hành dọn dẹp tiến trình FFmpeg...");
            if (ffmpegCommand) {
                try {
                    ffmpegCommand.kill('SIGKILL');
                    console.log("  - Đã đóng an toàn tiến trình FFmpeg.");
                } catch (e) {
                    console.error("  - Lỗi khi đóng FFmpeg:", e.message);
                }
                ffmpegCommand = null;
            }
        };

        try {
            console.log("\n[STREAM] --- BẮT ĐẦU TIẾN TRÌNH STREAM DỮ LIỆU SẠCH (YOUTUBEI.JS) ---");

            const sanitizedUrl = cleanYoutubeUrl(youtubeUrl);
            const videoId = sanitizedUrl.split('v=')[1];

            // BƯỚC 1: Khởi tạo InnerTube Client & Thu thập metadata
            console.log("[STREAM] Bước 1: Đang khởi tạo InnerTube Client và lấy metadata...");

            let ytOptions = {};
            try {
                // Định vị chính xác đường dẫn file cookies.json ở thư mục gốc của dự án
                const cookiePath = path.join(__dirname, '../cookies.json'); 
                if (fs.existsSync(cookiePath)) {
                    const cookieData = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
                    ytOptions.cookie = cookieData;
                    console.log("  -> Đã nạp thành công Cookies tài khoản để bypass!");
                } else {
                    console.log("  -> Không tìm thấy file cookies.json tại gốc. Chạy ở chế độ Guest...");
                }
            } catch (cookieErr) {
                console.warn("  [COOKIE WARNING] Không nạp được cookies, thử chạy ẩn danh:", cookieErr.message);
            }

            const yt = await Innertube.create(ytOptions);
            const videoInfo = await yt.getInfo(videoId);

            // TRÁNH CRASH: Sử dụng Optional Chaining an toàn khi parse thông tin cơ bản
            const title = videoInfo.basic_info?.title || "YouTube Audio Track";
            const durationSec = videoInfo.basic_info?.duration || 240;

            // Bypass lỗi undefined thumbnail: Kiểm tra kỹ mảng trước khi truy cập index [0]
            let thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            if (videoInfo.basic_info?.thumbnail && videoInfo.basic_info.thumbnail.length > 0) {
                thumbnail = videoInfo.basic_info.thumbnail[0].url;
            }

            console.log(`[YOUTUBE-INFO] Tiêu đề: ${title}`);
            console.log(`[YOUTUBE-INFO] Thời lượng: ${durationSec} giây`);

            // BƯỚC 2: Trích xuất luồng tải Audio trực tiếp từ YouTube
            console.log("[STREAM] Bước 2: Đang lấy luồng âm thanh trực tiếp từ YouTube...");
            const nodeReadableStream = await videoInfo.download({
                type: 'audio',
                quality: 'best',
                client: 'ANDROID_VR' // Bypass cực kỳ mượt trên môi trường Server/Cloud
            });

            // BƯỚC 3: Cấu hình luồng đẩy lên Cloudinary
            console.log("[STREAM] Bước 3: Đang mở cổng truyền lên Cloudinary...");
            const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'youtube_mp3_tracks',
                    resource_type: 'video',
                    format: 'mp3'
                },
                async (cloudinaryError, cloudinaryResult) => {
                    if (cloudinaryError) {
                        console.error("[CLOUDINARY ERROR] Upload thất bại:", cloudinaryError);
                        if (!isFinished) {
                            isFinished = true;
                            cleanup();
                            return reject(new Error("Không thể lưu file lên máy chủ Cloudinary."));
                        }
                    }

                    // BƯỚC 4: Lưu thông tin bản ghi vào Database
                    try {
                        console.log("[STREAM] Bước 4: Tải lên Cloudinary thành công! Đang lưu vào Database...");

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

                        console.log("[STREAM] --- HOÀN THÀNH TOÀN BỘ QUY TRÌNH XỬ LÝ! ---");
                        isFinished = true;
                        cleanup();
                        resolve(savedMusic);

                    } catch (dbError) {
                        console.error("[DATABASE ERROR] Lỗi tương tác MongoDB:", dbError.message);
                        if (!isFinished) {
                            isFinished = true;
                            cleanup();
                            reject(dbError);
                        }
                    }
                }
            );

            cloudinaryUploadStream.on('error', (err) => {
                console.error("[CLOUDINARY ERROR] Luồng ghi Cloudinary lỗi:", err.message);
                if (!isFinished) {
                    isFinished = true;
                    cleanup();
                    reject(new Error("Hệ thống mạng gián đoạn khi truyền dữ liệu đám mây."));
                }
            });

            // BƯỚC 5: Nạp trực tiếp stream từ InnerTube vào FFmpeg để chuyển sang MP3
            console.log("[STREAM] Bước 5: Đang pipe luồng âm thanh qua FFmpeg convert...");
            ffmpegCommand = ffmpeg(nodeReadableStream)
                .toFormat('mp3')
                .audioBitrate(128)
                .on('error', (ffmpegError) => {
                    if (isFinished) return;
                    console.error('[FFMPEG ERROR] Tiến trình convert bị đứt luồng:', ffmpegError.message);
                    isFinished = true;
                    cleanup();
                    reject(new Error("Lỗi nén nhạc hoặc luồng âm thanh nguồn bị ngắt đột ngột."));
                });

            // Ghi luồng trực tiếp lên Cloudinary
            ffmpegCommand.pipe(cloudinaryUploadStream);
            console.log("[STREAM] >>> Đang chuyển mã sang MP3 và tải lên Cloudinary... Vui lòng chờ...");

        } catch (error) {
            console.error("[STREAM FATAL ERROR] Lỗi hệ thống:", error.message);
            if (!isFinished) {
                isFinished = true;
                cleanup();
                reject(error);
            }
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

        const result = await processYoutubeToCloudinaryAndMongoStream(sanitizedUrl, playlistId);

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