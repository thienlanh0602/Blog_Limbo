const express = require('express');
const router = express.Router();
const createUploadMiddleware = require('../middleware/uploadCloudinary');
const {
    getAllPlaylists,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    deletePlaylist
} = require('../controllers/playlistController');

const upload = createUploadMiddleware('playlist_thumbnails');

router.get('/', getAllPlaylists);
router.get('/:id', getPlaylistById);

router.post('/', upload.single('thumbnail'), createPlaylist);
router.put('/:id', upload.single('thumbnail'), updatePlaylist);

router.delete('/:id', deletePlaylist);

module.exports = router;