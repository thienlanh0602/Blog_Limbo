const path = require('path');
const fs = require('fs');
const youtubeDl = require('youtube-dl-exec');
const ffmpeg = require('fluent-ffmpeg');
const cloudinary = require('../config/cloudinary');
const Music = require('../models/Music');
const Playlist = require('../models/Playlist'); 
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

// Định nghĩa chính xác đường dẫn tới file cookies.txt của bạn
const cookiesPath = path.join(__dirname, '../cookies.txt'); 

// ==========================================
// 1. HÀM LẤY METADATA (ĐÃ SỬA FLAG COOKIES)
// ==========================================
const getVideoMetadata = async (youtubeUrl) => {
    console.log(`\n[METADATA] >>> Bắt đầu lấy thông tin từ YouTube URL: ${youtubeUrl}`);
    try {
        const meta = await youtubeDl(youtubeUrl, {
            dumpSingleJson: true,
            noWarnings: true,
            cookies: cookiesPath // <--- ĐÃ SỬA THÀNH 'cookies' thay vì 'cookie'
        });

        console.log(`[METADATA] <<< Lấy thông tin thành công!`);
        console.log(`  - Tiêu đề: "${meta.title}"`);
        console.log(`  - Thời lượng: ${meta.duration} giây`);
        console.log(`  - Thumbnail: ${meta.thumbnail ? "Có" : "Không có"}`);

        return {
            title: meta.title,
            duration: meta.duration,
            thumbnail: meta.thumbnail
        };
    } catch (error) {
        console.error(`[METADATA ERROR] Xảy ra lỗi khi lấy metadata từ YouTube:`, error.message);
        throw new Error("Không thể lấy thông tin metadata từ YouTube: " + error.message);
    }
};

// ==========================================
// 2. HÀM STREAM & CONVERT (ĐÃ SỬA FLAG COOKIES)
// ==========================================
const processYoutubeToCloudinaryAndMongoStream = async (youtubeUrl, playlistId) => {
    return new Promise(async (resolve, reject) => {
        let ytProcess = null;
        let ffmpegCommand = null;
        let isFinished = false;

        const cleanup = () => {
            console.log("[CLEANUP] Đang dọn dẹp tiến trình chạy ngầm...");
            if (ytProcess) {
                try {
                    ytProcess.kill('SIGKILL');
                    console.log("  - Đã đóng tiến trình yt-dlp.");
                } catch (e) {
                    console.error("  - Lỗi khi đóng yt-dlp:", e.message);
                }
                ytProcess = null;
            }
            if (ffmpegCommand) {
                try {
                    ffmpegCommand.kill('SIGKILL');
                    console.log("  - Đã đóng tiến trình FFmpeg.");
                } catch (e) {
                    console.error("  - Lỗi khi đóng FFmpeg:", e.message);
                }
                ffmpegCommand = null;
            }
        };

        try {
            console.log("\n[STREAM] --- BẮT ĐẦU QUÁ TRÌNH TẢI & CONVERT NHẠC ---");
            
            // BƯỚC 1: Lấy Metadata
            console.log("[STREAM] Bước 1: Đang lấy thông tin video...");
            const metaData = await getVideoMetadata(youtubeUrl);

            if (metaData.duration > 600) {
                console.warn(`[STREAM LIMIT] Video quá dài (${metaData.duration}s). Từ chối xử lý.`);
                return reject(new Error("Video quá dài! Vui lòng chọn video ngắn hơn 10 phút để hệ thống xử lý mượt mà."));
            }

            // BƯỚC 2: Khởi tạo yt-dlp với flag cookies chuẩn xác
            console.log("[STREAM] Bước 2: Khởi tạo luồng tải Audio bằng yt-dlp...");
            ytProcess = youtubeDl.exec(youtubeUrl, {
                output: '-', 
                format: 'bestaudio',
                noWarnings: true,
                cookies: cookiesPath // <--- ĐÃ SỬA THÀNH 'cookies' thay vì 'cookie'
            });

            const youtubeAudioStream = ytProcess.stdout;

            // Bắt lỗi luồng tải của yt-dlp
            ytProcess.on('error', (err) => {
                console.error("[STREAM ERROR] Lỗi tiến trình con yt-dlp:", err.message);
                if (!isFinished) {
                    isFinished = true;
                    cleanup();
                    reject(new Error("Lỗi luồng tải dữ liệu từ YouTube: " + err.message));
                }
            });

            youtubeAudioStream.on('error', (err) => {
                console.error("[STREAM ERROR] Lỗi luồng stream stdout của yt-dlp:", err.message);
                if (!isFinished) {
                    isFinished = true;
                    cleanup();
                    reject(new Error("Lỗi đọc dữ liệu âm thanh từ YouTube"));
                }
            });

            // BƯỚC 3: Thiết lập Cloudinary Stream
            console.log("[STREAM] Bước 3: Thiết lập luồng tải lên Cloudinary...");
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
                            return reject(new Error("Lỗi truyền dữ liệu lên Cloudinary"));
                        }
                    }

                    // BƯỚC 4: Lưu vào DB
                    try {
                        console.log("[STREAM] Bước 4: Upload Cloudinary thành công! Đang lưu thông tin vào MongoDB...");
                        console.log(`  - Cloudinary URL: ${cloudinaryResult.secure_url}`);
                        console.log(`  - Public ID: ${cloudinaryResult.public_id}`);

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
                        console.log(`[DATABASE] Đã lưu bài hát mới vào DB với ID: ${savedMusic._id}`);

                        if (playlistId) {
                            console.log(`[DATABASE] -> Đang gán bài hát vào Playlist ID: ${playlistId}`);
                            await Playlist.findByIdAndUpdate(
                                playlistId,
                                { $push: { tracks: savedMusic._id } }
                            );
                            console.log(`[DATABASE] -> Đã gán vào Playlist thành công!`);
                        }

                        console.log("[STREAM] --- HOÀN TẤT XỬ LÝ TOÀN BỘ QUY TRÌNH! ---");
                        isFinished = true;
                        cleanup(); 
                        resolve(savedMusic);

                    } catch (dbError) {
                        console.error("[DATABASE ERROR] Lỗi thao tác MongoDB:", dbError.message);
                        if (!isFinished) {
                            isFinished = true;
                            cleanup();
                            reject(dbError);
                        }
                    }
                }
            );

            // Bắt lỗi luồng ghi của Cloudinary
            cloudinaryUploadStream.on('error', (err) => {
                console.error("[CLOUDINARY ERROR] Lỗi luồng ghi ghi lên Cloudinary:", err.message);
                if (!isFinished) {
                    isFinished = true;
                    cleanup();
                    reject(new Error("Lỗi luồng tải lên Cloudinary"));
                }
            });

            // BƯỚC 5: Chạy FFmpeg convert và Pipe luồng
            console.log("[STREAM] Bước 5: Bắt đầu truyền luồng qua FFmpeg để convert sang MP3...");
            ffmpegCommand = ffmpeg(youtubeAudioStream)
                .toFormat('mp3')
                .audioBitrate(128)
                .on('error', (ffmpegError) => {
                    if (isFinished) return;
                    console.error('[FFMPEG ERROR] Lỗi tiến trình convert của FFmpeg:', ffmpegError.message);
                    isFinished = true;
                    cleanup();
                    reject(new Error("Lỗi chuyển đổi định dạng âm thanh trên RAM"));
                });

            ffmpegCommand.pipe(cloudinaryUploadStream);
            console.log("[STREAM] >>> Đang chuyển đổi và tải lên đám mây... Vui lòng đợi...");

        } catch (error) {
            console.error("[STREAM FATAL ERROR] Lỗi nghiêm trọng ngoài ý muốn:", error.message);
            if (!isFinished) {
                isFinished = true;
                cleanup();
                reject(error);
            }
        }
    });
};

// Helper làm sạch link YouTube
const cleanYoutubeUrl = (url) => {
    if (!url) return null;
    console.log(`[HELPER] Đang làm sạch link YouTube gốc: ${url}`);
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        const cleaned = `https://www.youtube.com/watch?v=${videoId}`;
        console.log(`[HELPER] -> Link rút gọn biến đổi thành: ${cleaned}`);
        return cleaned;
    }
    if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        if (videoId) {
            const cleaned = `https://www.youtube.com/watch?v=${videoId}`;
            console.log(`[HELPER] -> Link chuẩn hóa thành: ${cleaned}`);
            return cleaned;
        }
    }
    return url;
};

// ==========================================
// 3. API DOWNLOAD & SAVE
// ==========================================
const handleDownloadAndSave = async (req, res) => {
    console.log(`\n[API POST /api/music] Nhận yêu cầu tải nhạc!`);
    console.log(`  - Body nhận được:`, req.body);

    try {
        const { url, playlistId } = req.body;

        if (!url) {
            console.warn(`[API WARNING] Yêu cầu thiếu URL.`);
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp link YouTube hợp lệ!"
            });
        }
        const sanitizedUrl = cleanYoutubeUrl(url);

        const result = await processYoutubeToCloudinaryAndMongoStream(sanitizedUrl, playlistId);

        console.log(`[API SUCCESS] Gửi phản hồi thành công về cho Client!`);
        return res.status(201).json({
            success: true,
            message: playlistId
                ? "Tải nhạc và gán tự động vào Playlist thành công!"
                : "Tải nhạc thành công (Không gán vào Playlist)!",
            data: result
        });

    } catch (error) {
        console.error(`[API ERROR 500] Thất bại tại handleDownloadAndSave:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra trong quá trình xử lý hệ thống!",
            error: error.message
        });
    }
};

// ==========================================
// 4. API GET ALL MUSIC
// ==========================================
const getAllMusic = async (req, res) => {
    console.log(`\n[API GET /api/music] Đang lấy danh sách nhạc từ Database...`);
    try {
        const musicList = await Music.find().sort({ createdAt: -1 });
        console.log(`[API SUCCESS] Đã tìm thấy ${musicList.length} bài hát.`);
        return res.status(200).json({
            success: true,
            data: musicList
        });
    } catch (error) {
        console.error("[API ERROR 500] Lỗi lấy danh sách nhạc:", error.message);
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
    console.log(`\n[API DELETE /api/music/${id}] Nhận yêu cầu xóa bài nhạc!`);
    try {
        const musicItem = await Music.findById(id);
        if (!musicItem) {
            console.warn(`[API WARNING] Không tìm thấy bài hát ID: ${id} trong DB để xóa.`);
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài hát để xóa!"
            });
        }

        if (musicItem.cloudinaryPublicId) {
            console.log(`[CLOUDINARY] Tiến hành xóa file trên Cloudinary với Public ID: ${musicItem.cloudinaryPublicId}`);

            await new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(
                    musicItem.cloudinaryPublicId,
                    { resource_type: 'video' },
                    (cloudinaryError, cloudinaryResult) => {
                        if (cloudinaryError) {
                            console.error("[CLOUDINARY ERROR] Lỗi xóa file:", cloudinaryError.message);
                            resolve(); 
                        } else {
                            console.log("[CLOUDINARY] Kết quả xóa thành công:", cloudinaryResult);
                            resolve(cloudinaryResult);
                        }
                    }
                );
            });
        }

        console.log(`[DATABASE] Đang gỡ bỏ ID bài hát khỏi các Playlist tương ứng...`);
        const updatePlaylistResult = await Playlist.updateMany(
            { tracks: id },
            { $pull: { tracks: id } }
        );
        console.log(`[DATABASE] Đã cập nhật xong các Playlist (Ảnh hưởng: ${updatePlaylistResult.modifiedCount} playlist).`);

        await Music.findByIdAndDelete(id);
        console.log(`[DATABASE] Đã xóa bài hát ID: ${id} khỏi cơ sở dữ liệu.`);

        return res.status(200).json({
            success: true,
            message: "Xóa bài hát thành công khỏi hệ thống, Cloudinary và mọi Playlist tương ứng! 🎉"
        });

    } catch (error) {
        console.error(`[API ERROR 500] Thất bại tại deleteMusic:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi xóa bài hát!"
        });
    }
};

module.exports = { handleDownloadAndSave, getAllMusic, deleteMusic };