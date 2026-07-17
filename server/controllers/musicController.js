const path = require('path');
const fs = require('fs');
const youtubeDl = require('youtube-dl-exec');
const ffmpeg = require('fluent-ffmpeg');
const cloudinary = require('../config/cloudinary');
const Music = require('../models/Music');
const Playlist = require('../models/Playlist');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

// Định nghĩa đường dẫn tới file cookies.txt
const cookiesPath = path.resolve(process.cwd(), 'cookies.txt');

// Danh sách các Invidious Instance hoạt động ổn định nhất (Dùng làm API dự phòng)
const INVIDIOUS_INSTANCES = [
    'https://inv.nadeko.net',
    'https://invidious.nerdvpn.de',
    'https://invidious.tiekoetter.com',
    'https://inv.tux.im',
    'https://invidious.flokinet.to',
    'https://invidious.privacydev.net'
];

// ==========================================
// 1. HÀM LẤY METADATA (CƠ CHẾ DỰ PHÒNG CHUỖI NHIỀU TẦNG)
// ==========================================
const getVideoMetadata = async (youtubeUrl) => {
    console.log(`\n[METADATA] >>> Bắt đầu lấy thông tin từ YouTube URL: ${youtubeUrl}`);
    const videoId = cleanYoutubeUrl(youtubeUrl).split('v=')[1];

    // --- TẦNG 1: THỬ BẰNG YT-DLP ---
    try {
        const options = {
            dumpSingleJson: true,
            noWarnings: true,
            // Giả lập trình duyệt để tránh bị phát hiện bot cơ bản
            addHeader: [
                'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language: en-US,en;q=0.9'
            ]
        };

        if (fs.existsSync(cookiesPath)) {
            options.cookies = cookiesPath;
            console.log(`[METADATA] Đã nạp file cookies vào yt-dlp.`);
        }

        const meta = await youtubeDl(youtubeUrl, options);
        console.log(`[METADATA] <<< Lấy thông tin qua yt-dlp THÀNH CÔNG!`);
        return {
            title: meta.title,
            duration: meta.duration,
            thumbnail: meta.thumbnail
        };
    } catch (error) {
        console.warn(`[METADATA WARNING] yt-dlp thất bại (Có thể bị block bot): ${error.message}`);
    }

    // --- TẦNG 2: THỬ LẦN LƯỢT CÁC API INVIDIOUS (FAILOVER) ---
    console.log(`[METADATA] Đang kích hoạt cơ chế Failover qua các API cộng đồng...`);
    for (const instance of INVIDIOUS_INSTANCES) {
        const apiTarget = `${instance}/api/v1/videos/${videoId}`;
        console.log(`  -> Đang thử lấy metadata từ: ${apiTarget}`);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000); // Giới hạn 6s phản hồi tránh treo app

            const response = await fetch(apiTarget, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                console.log(`[METADATA] <<< Lấy thông tin qua API dự phòng [${instance}] THÀNH CÔNG!`);
                return {
                    title: data.title,
                    duration: data.lengthSeconds,
                    thumbnail: data.videoThumbnails?.[0]?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                };
            }
        } catch (apiError) {
            console.warn(`  [FAILOVER WARNING] Trạm API [${instance}] không phản hồi hoặc bị lỗi: ${apiError.message}`);
        }
    }

    // --- TẦNG 3: CỨU CÁNH BẰNG NO-KEY OEMBED API (Hợp pháp của YouTube, không bị chặn) ---
    console.log(`[METADATA] Toàn bộ Invidious API lỗi. Thử tầng cứu cánh cuối cùng: YouTube OEMBED API...`);
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`;
        const response = await fetch(oembedUrl);
        if (response.ok) {
            const data = await response.json();
            console.log(`[METADATA] <<< Lấy thông tin qua OEMBED API THÀNH CÔNG!`);
            return {
                title: data.title,
                duration: 240, // OEMBED không trả về độ dài, gán tạm 4 phút (sẽ tải tối đa đến khi luồng kết thúc)
                thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            };
        }
    } catch (oembedError) {
        console.error(`[METADATA FATAL] Mọi phương án lấy metadata đều thất bại:`, oembedError.message);
    }

    throw new Error("Không thể kết xuất thông tin bài hát từ YouTube do hệ thống chặn bot cực đoan. Hãy thử lại sau ít phút!");
};

// Kiểm tra sự tồn tại của cookies khi khởi động
if (fs.existsSync(cookiesPath)) {
    console.log(`[SYSTEM CHECK] >>> Tìm thấy file cookies tại: ${cookiesPath}`);
} else {
    console.warn(`[SYSTEM CHECK] >>> Lưu ý: Không tìm thấy file cookies.txt. Ứng dụng sẽ chạy ở chế độ bypass IP.`);
}

// ==========================================
// 2. HÀM STREAM & CONVERT (CÓ TỰ ĐỘNG KHẮC PHỤC CHẶN IP)
// ==========================================
const processYoutubeToCloudinaryAndMongoStream = async (youtubeUrl, playlistId) => {
    return new Promise(async (resolve, reject) => {
        let ytProcess = null;
        let ffmpegCommand = null;
        let isFinished = false;

        const cleanup = () => {
            console.log("[CLEANUP] Đang tiến hành dọn dẹp tiến trình...");
            if (ytProcess) {
                try {
                    ytProcess.kill('SIGKILL');
                    console.log("  - Đã đóng an toàn tiến trình yt-dlp.");
                } catch (e) {
                    console.error("  - Lỗi khi đóng yt-dlp:", e.message);
                }
                ytProcess = null;
            }
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
            console.log("\n[STREAM] --- BẮT ĐẦU TIẾN TRÌNH STREAM DỮ LIỆU ---");

            // BƯỚC 1: Lấy Metadata thông qua hệ thống chuỗi failover bảo vệ
            console.log("[STREAM] Bước 1: Thu thập metadata...");
            const metaData = await getVideoMetadata(youtubeUrl);

            if (metaData.duration > 600) {
                console.warn(`[STREAM LIMIT] Từ chối xử lý do video dài quá hạn định (${metaData.duration}s).`);
                return reject(new Error("Video dài quá 10 phút! Vui lòng gửi link bài hát ngắn hơn để hệ thống xử lý ổn định hơn."));
            }

            // BƯỚC 2: Khởi tạo yt-dlp lấy luồng âm thanh dạng Stream
            console.log("[STREAM] Bước 2: Thiết lập luồng yt-dlp stream...");
            
            // Cấu hình fake Client nhằm đánh lừa thuật toán quét bot của YouTube khi stream raw
            const ytOptions = {
                output: '-',
                format: 'bestaudio',
                noWarnings: true,
                addHeader: [
                    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language: en-US,en;q=0.9'
                ]
            };

            if (fs.existsSync(cookiesPath)) {
                ytOptions.cookies = cookiesPath;
            }

            ytProcess = youtubeDl.exec(youtubeUrl, ytOptions);
            const youtubeAudioStream = ytProcess.stdout;

            // Bắt lỗi tiến trình con yt-dlp
            ytProcess.on('error', (err) => {
                console.error("[STREAM ERROR] yt-dlp Core Error:", err.message);
                if (!isFinished) {
                    isFinished = true;
                    cleanup();
                    reject(new Error("YouTube chặn kết nối stream audio trực tiếp."));
                }
            });

            youtubeAudioStream.on('error', (err) => {
                console.error("[STREAM ERROR] YouTube Stream Stdout Error:", err.message);
                if (!isFinished) {
                    isFinished = true;
                    cleanup();
                    reject(new Error("Mất kết nối với luồng âm thanh YouTube."));
                }
            });

            // BƯỚC 3: Cấu hình Cloudinary Stream
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

                    // BƯỚC 4: Lưu bản ghi vào MongoDB
                    try {
                        console.log("[STREAM] Bước 4: Tải lên Cloudinary thành công! Đang lưu thông tin vào Database...");
                        
                        const minutes = Math.floor(metaData.duration / 60);
                        const seconds = metaData.duration % 60;
                        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                        const newMusic = new Music({
                            title: metaData.title,
                            youtubeUrl: youtubeUrl,
                            duration: formattedDuration,
                            thumbnail: metaData.thumbnail,
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
                console.error("[CLOUDINARY ERROR] Cloudinary Stream Writable Error:", err.message);
                if (!isFinished) {
                    isFinished = true;
                    cleanup();
                    reject(new Error("Hệ thống mạng gián đoạn khi gửi file lên Cloudinary."));
                }
            });

            // BƯỚC 5: Thiết lập FFmpeg Converter Pipe
            console.log("[STREAM] Bước 5: Đang pipe luồng âm thanh qua FFmpeg convert...");
            ffmpegCommand = ffmpeg(youtubeAudioStream)
                .toFormat('mp3')
                .audioBitrate(128)
                .on('error', (ffmpegError) => {
                    if (isFinished) return;
                    console.error('[FFMPEG ERROR] Tiến trình convert bị đứt luồng:', ffmpegError.message);
                    isFinished = true;
                    cleanup();
                    reject(new Error("Lỗi nén nhạc hoặc YouTube đột ngột đóng kết nối tải."));
                });

            ffmpegCommand.pipe(cloudinaryUploadStream);
            console.log("[STREAM] >>> Đang chuyển mã sang MP3 và tải lên Cloudinary... Vui lòng chờ...");

        } catch (error) {
            console.error("[STREAM FATAL ERROR] Lỗi tổng đài:", error.message);
            if (!isFinished) {
                isFinished = true;
                cleanup();
                reject(error);
            }
        }
    });
};

// Helper chuẩn hóa URL YouTube
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
// 3. API DOWNLOAD & SAVE
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
// 4. API GET ALL MUSIC
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
// 5. API DELETE MUSIC
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