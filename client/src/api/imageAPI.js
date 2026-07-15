import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL;

// lấy danh sách ảnh
export const getImageAdmin = async () => {
    const res = await axios.get(`${API_URL}/api/image/`);
    return res.data;
}

// thêm ảnh
export const createImageAdmin = async (formData) => {
    try {
        const res = await axios.post(`${API_URL}/api/image/`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
        return res.data;

    } catch (error) {
        console.error('Lỗi khi tạo ảnh', error);
        throw error;
    }
}

// cập nhật ảnh
export const updateImageAdmin = async (id, formData) => {
    try {
        const res = await axios.put(`${API_URL}/api/image/${id}`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return res.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật ảnh:', error);
        throw error;
    }
}

// xoá ảnh
export const deleteImageAdmin = async (id) => {
    const res = await axios.delete(`${API_URL}/api/image/${id}`)
    return res.data;
}