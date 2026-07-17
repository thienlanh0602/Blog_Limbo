const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const cloudinary = require('../config/cloudinary');
const Music = require('../models/Music');
const Playlist = require('../models/Playlist');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

// ==========================================
// 1. HÀM LẤY LUỒNG AUDIO DIRECT (BYPASS YT-DLP)
// ==========================================
const getDirectAudioUrlAndMetadata = async (youtubeUrl) => {
    console.log(`\n[BYPASS-API] >>> Đang lấy luồng audio bypass cho URL: ${youtubeUrl}`);
    const videoId = cleanYoutubeUrl(youtubeUrl).split('v=')[1];

    // Thử danh sách các API Gateway chất lượng cao để lấy trực tiếp link audio stream từ YouTube
    const streamGateways = [
        `https://cobalt-api.lunes.host`,
        `https://api.cobalt.tools`,
        `https://cobalt.shas.moe`
    ];

    for (const gateway of streamGateways) {
        console.log(`  -> Thử lấy luồng audio từ Gateway: ${gateway}`);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 giây timeout

            const response = await fetch(gateway, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: youtubeUrl,
                    videoQuality: '720', // Thiết lập chung
                    audioFormat: 'best', // Lấy audio chất lượng cao nhất
                    audioOnly: true,     // Chỉ lấy audio
                    disableMetadata: false
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (data && data.url) {
                    console.log(`[BYPASS-API] <<< Lấy luồng trực tiếp THÀNH CÔNG từ ${gateway}!`);
                    
                    // Lấy thông tin video thông qua OEMBED của YouTube hoặc gán mặc định
                    let title = "YouTube Audio Track";
                    try {
                        const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`);
                        if (oembedRes.ok) {
                            const oembedData = await oembedRes.json();
                            title = oembedData.title;
                        }
                    } catch (e) {
                        console.warn("[METADATA WARNING] Không lấy được tiêu đề chuẩn, dùng tiêu đề gốc.");
                    }

                    return {
                        audioStreamUrl: data.url, // Link luồng audio trực tiếp (không bị chặn IP)
                        title: title,
                        duration: 240, // Giá trị tượng trưng (FFmpeg sẽ tải đến khi hết luồng thực tế)
                        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    };
                }
            }
        } catch (err) {
            console.warn(`  [GATEWAY WARNING] Trạm ${gateway} thất bại: ${err.message}`);
        }
    }

    throw new Error("Không thể trích xuất luồng âm thanh từ bài hát này. YouTube đang thắt chặt bảo mật, hãy thử lại bài hát khác!");
};

// ==========================================
// 2. TIẾN TRÌNH STREAM QUA FFMPEG LÊN CLOUDINARY
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
            console.log("\n[STREAM] --- BẮT ĐẦU TIẾN TRÌNH STREAM DỮ LIỆU SẠCH ---");

            // BƯỚC 1: Lấy link audio direct từ cổng bypass
            console.log("[STREAM] Bước 1: Thu thập metadata & luồng trực tiếp...");
            const mediaData = await getDirectAudioUrlAndMetadata(youtubeUrl);

            // BƯỚC 2: Cấu hình cổng nhận của Cloudinary
            console.log("[STREAM] Bước 2: Đang mở cổng truyền lên Cloudinary...");
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

                    // BƯỚC 3: Lưu bản ghi vào Database
                    try {
                        console.log("[STREAM] Bước 3: Tải lên Cloudinary thành công! Đang lưu vào Database...");
                        
                        const minutes = Math.floor(mediaData.duration / 60);
                        const seconds = mediaData.duration % 60;
                        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                        const newMusic = new Music({
                            title: mediaData.title,
                            youtubeUrl: youtubeUrl,
                            duration: formattedDuration,
                            thumbnail: mediaData.thumbnail,
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

            // BƯỚC 4: Chạy FFmpeg convert trực tiếp luồng Audio URL sang MP3
            console.log("[STREAM] Bước 3: Đang pipe luồng âm thanh trực tiếp từ API sang FFmpeg...");
            
            ffmpegCommand = ffmpeg(mediaData.audioStreamUrl)
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
            console.log("[STREAM] >>> Đang chuyển mã và tải lên đám mây... Vui lòng đợi...");

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