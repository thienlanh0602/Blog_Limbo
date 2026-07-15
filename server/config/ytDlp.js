const youtubeDl = require('youtube-dl-exec');
const ffmpeg = require('@ffmpeg-installer/ffmpeg'); 

const downloadAudio = async (youtubeUrl, outputPath) => {
    return youtubeDl(youtubeUrl, {
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        output: outputPath,
        ffmpegLocation: ffmpeg.path 
    });
};

module.exports = { downloadAudio };