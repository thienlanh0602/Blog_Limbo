import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

export const getMusicAdmin = async () => {
    const res = await axios.get(`${API_URL}/api/music/`);
    return res.data;
};

export const createMusicFromYoutube = async (youtubeUrl, playlistId = null) => {
    try {
        const res = await axios.post(`${API_URL}/api/music/`, { 
            url: youtubeUrl, 
            playlistId 
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi convert link:', error);
        throw error;
    }
};

export const deleteMusicAdmin = async (id) => {
    const res = await axios.delete(`${API_URL}/api/music/${id}`);
    return res.data;
};