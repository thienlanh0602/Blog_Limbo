const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { downloadAudio } = require('../config/ytDlp');
const cloudinary = require('../config/cloudinary'); // Import trực tiếp object đã config từ file của bạn
const Music = require('../models/Music');

// Hàm bổ trợ lấy thông tin Metadata của Video bằng lệnh yt-dlp
const getVideoMetadata = (youtubeUrl) => {
    return new Promise((resolve, reject) => {
        // Lệnh lấy thông tin dạng JSON mà không cần tải video
        const command = `yt-dlp --dump-json "${youtubeUrl}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) return reject(error);
            try {
                const meta = JSON.parse(stdout);
                resolve({
                    title: meta.title,
                    duration: meta.duration, // đơn vị: giây
                    thumbnail: meta.thumbnail
                });
            } catch (e) {
                reject(e);
            }
        });
    });
};

const processYoutubeToCloudinaryAndMongo = async (youtubeUrl) => {
    let localFilePath = null;
    try {
        // Bước 1: Lấy thông tin (Metadata) của video MP4 gốc
        console.log("1. Đang lấy thông tin video...");
        const metaData = await getVideoMetadata(youtubeUrl);

        // Bước 2: Tải và chuyển đổi thành MP3 local
        console.log("2. Đang tải và convert sang MP3...");
        const outputFolder = path.join(__dirname, '../public/downloads');
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }
        
        const timestamp = Date.now();
        // Cấu hình yt-dlp xuất file có chứa timestamp để không bị trùng
        await downloadAudio(youtubeUrl, path.join(outputFolder, `audio_${timestamp}.%(ext)s`));

        // Tìm đúng file vừa tải về trong thư mục
        const files = fs.readdirSync(outputFolder);
        const downloadedFile = files.find(file => file.includes(String(timestamp)));
        if (!downloadedFile) throw new Error("Không tìm thấy file MP3 sau khi tải.");
        
        localFilePath = path.join(outputFolder, downloadedFile);

        // Bước 3: Upload file MP3 đó lên Cloudinary thông qua SDK gốc
        console.log("3. Đang upload MP3 lên Cloudinary...");
        const cloudinaryResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(localFilePath, {
                folder: 'youtube_mp3_tracks', // Tên thư mục trên Cloudinary của bạn
                resource_type: 'video'        // Bắt buộc là 'video' cho file định dạng âm thanh (mp3, wav...)
            }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });

        // Bước 4: Lưu toàn bộ thông tin thu thập được vào MongoDB
        console.log("4. Đang lưu thông tin vào MongoDB...");
        const minutes = Math.floor(metaData.duration / 60);
        const seconds = metaData.duration % 60;
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Định dạng mm:ss chuẩn hơn

        const newMusic = new Music({
            title: metaData.title,
            youtubeUrl: youtubeUrl,
            duration: formattedDuration,
            thumbnail: metaData.thumbnail,
            cloudinaryUrl: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id
        });

        const savedMusic = await newMusic.save();

        // Bước 5: Xóa file tạm tại local server để giải phóng ổ cứng
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
            console.log("5. Đã xóa file tạm local.");
        }

        return savedMusic;

    } catch (error) {
        // Đảm bảo file tạm luôn được dọn dẹp sạch sẽ nếu có bất kỳ lỗi nào xảy ra giữa chừng
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        throw error;
    }
};

module.exports = { processYoutubeToCloudinaryAndMongo };