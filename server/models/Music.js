const mongoose = require('mongoose');

const MusicSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    artist: {
        type: String,
        default: 'Không rõ nghệ sĩ'
    },
    youtubeUrl: { 
        type: String, 
        required: true 
    },
    duration: { 
        type: String 
    },
    thumbnail: { 
        type: String
    },
    cloudinaryUrl: { 
        type: String, 
        required: true
    },
    cloudinaryPublicId: { 
        type: String
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Music', MusicSchema);