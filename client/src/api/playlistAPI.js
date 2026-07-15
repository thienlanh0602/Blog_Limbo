import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

// 1. Lấy toàn bộ danh sách playlist (để hiển thị hoặc đưa vào Dropdown/Select)
export const getPlaylists = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/playlist`);
        return res.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách playlist:', error);
        throw error;
    }
};

// 2. Lấy chi tiết 1 playlist (Bao gồm danh sách các bài hát thuộc tracks)
export const getPlaylistDetail = async (id) => {
    try {
        const res = await axios.get(`${API_URL}/api/playlist/${id}`);
        return res.data;
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết playlist:', error);
        throw error;
    }
};

// 3. Tạo mới một playlist (Nhận vào FormData chứa 'name' và file 'thumbnail')
export const createPlaylist = async (formData) => {
    try {
        const res = await axios.post(`${API_URL}/api/playlist`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Bắt buộc khi có upload file ảnh
            }
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi tạo mới playlist:', error);
        throw error;
    }
};

// 4. Cập nhật Playlist (Nhận vào id và FormData chứa 'name' hoặc file 'thumbnail' mới)
export const updatePlaylist = async (id, formData) => {
    try {
        const res = await axios.put(`${API_URL}/api/playlist/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật playlist:', error);
        throw error;
    }
};

// 5. Xóa hoàn toàn một playlist theo ID
export const deletePlaylist = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/api/playlist/${id}`);
        return res.data;
    } catch (error) {
        console.error('Lỗi khi xóa playlist:', error);
        throw error;
    }
};