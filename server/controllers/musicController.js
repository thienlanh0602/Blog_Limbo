const path = require('path');
const fs = require('fs');
const youtubeDl = require('youtube-dl-exec');
const ffmpeg = require('fluent-ffmpeg');
const cloudinary = require('../config/cloudinary');
const Music = require('../models/Music');
const Playlist = require('../models/Playlist'); 
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const getVideoMetadata = async (youtubeUrl) => {
    try {
        const meta = await youtubeDl(youtubeUrl, {
            dumpSingleJson: true,
            noWarnings: true,
            preferFreeFormats: true
        });

        return {
            title: meta.title,
            duration: meta.duration,
            thumbnail: meta.thumbnail
        };
    } catch (error) {
        throw new Error("Không thể lấy thông tin metadata từ YouTube: " + error.message);
    }
};

const processYoutubeToCloudinaryAndMongoStream = async (youtubeUrl, playlistId) => {
    return new Promise(async (resolve, reject) => {
        let ytProcess = null;
        try {
            console.log("1. Đang lấy thông tin video...");
            const metaData = await getVideoMetadata(youtubeUrl);

            if (metaData.duration > 600) {
                return reject(new Error("Video quá dài! Vui lòng chọn video ngắn hơn 10 phút để hệ thống xử lý mượt mà."));
            }

            console.log("2. Khởi tạo luồng tải Audio bằng yt-dlp...");
            ytProcess = youtubeDl.exec(youtubeUrl, {
                output: '-',     
                format: 'bestaudio',
                noWarnings: true
            });

            const youtubeAudioStream = ytProcess.stdout;

            console.log("3. Thiết lập cấu hình truyền luồng lên Cloudinary...");
            const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'youtube_mp3_tracks',
                    resource_type: 'video',
                    format: 'mp3'
                },
                async (cloudinaryError, cloudinaryResult) => {
                    if (cloudinaryError) {
                        console.error("Lỗi luồng upload Cloudinary:", cloudinaryError);
                        return reject(new Error("Lỗi truyền dữ liệu lên Cloudinary"));
                    }

                    try {
                        console.log("4. Đang lưu thông tin vào MongoDB...");
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

                        if (playlistId) {
                            console.log(`-> Tiến hành gán bài hát mới vào Playlist ID: ${playlistId}`);
                            await Playlist.findByIdAndUpdate(
                                playlistId,
                                { $push: { tracks: savedMusic._id } }
                            );
                        }

                        console.log("-> Hoàn tất xử lý dữ liệu bằng Stream qua yt-dlp!");
                        resolve(savedMusic);

                    } catch (dbError) {
                        reject(dbError);
                    }
                }
            );

            ffmpeg(youtubeAudioStream)
                .toFormat('mp3')
                .audioBitrate(128)
                .on('error', (ffmpegError) => {
                    console.error('Lỗi trong tiến trình convert của Ffmpeg:', ffmpegError);
                    if (ytProcess) ytProcess.kill();
                    reject(new Error("Lỗi chuyển đổi định dạng âm thanh trên RAM"));
                })
                .pipe(cloudinaryUploadStream);

        } catch (error) {
            if (ytProcess) ytProcess.kill();
            reject(error);
        }
    });
};

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

const handleDownloadAndSave = async (req, res) => {
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
                : "Tải nhạc thành công (Không gán vào Playlist)!",
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra trong quá trình xử lý hệ thống!",
            error: error.message
        });
    }
};

// 1. Hàm lấy toàn bộ danh sách nhạc (Giữ nguyên)
const getAllMusic = async (req, res) => {
    try {
        const musicList = await Music.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data: musicList
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách nhạc tại Controller:", error);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi lấy danh sách nhạc!"
        });
    }
};

// 2. Hàm xóa bài hát theo ID (Giữ nguyên)
const deleteMusic = async (req, res) => {
    try {
        const { id } = req.params;

        const musicItem = await Music.findById(id);
        if (!musicItem) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài hát để xóa!"
            });
        }

        if (musicItem.cloudinaryPublicId) {
            console.log(`Đang tiến hành xóa file trên Cloudinary với Public ID: ${musicItem.cloudinaryPublicId}`);

            await new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(
                    musicItem.cloudinaryPublicId,
                    { resource_type: 'video' },
                    (cloudinaryError, cloudinaryResult) => {
                        if (cloudinaryError) {
                            console.error("Lỗi khi xóa file trên Cloudinary:", cloudinaryError);
                            resolve();
                        } else {
                            console.log("Kết quả xóa Cloudinary:", cloudinaryResult);
                            resolve(cloudinaryResult);
                        }
                    }
                );
            });
        }

        // --- THÊM MỚI: Khi bài hát bị xóa, xóa ID của nó khỏi mảng tracks trong tất cả Playlist ---
        await Playlist.updateMany(
            { tracks: id },
            { $pull: { tracks: id } } // Lệnh $pull sẽ gỡ bỏ id khỏi mảng
        );
        // -----------------------------------------------------------------------------------

        await Music.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Xóa bài hát thành công khỏi hệ thống, Cloudinary và mọi Playlist tương ứng! 🎉"
        });

    } catch (error) {
        console.error("Lỗi xóa bài hát tại Controller:", error);
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi xóa bài hát!"
        });
    }
};

module.exports = { handleDownloadAndSave, getAllMusic, deleteMusic };