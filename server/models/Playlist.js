const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    description: { 
        type: String, 
        trim: true,
        default: ''
    },
    thumbnail: { 
        type: String,
        default: 'https://via.placeholder.com/300x300?text=No+Playlist+Image'
    },
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Music'
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);