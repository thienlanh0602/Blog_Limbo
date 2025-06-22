import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL;

//lấy tên admin
export const getHomepageAdmin = async () => {
    const res = await axios.get(`${API_URL}/api/homepage/`);
    return res.data;
}


// Thêm bài 
export const createHomePageAdmin = async (formData) => {

    try {
        const res = await axios.post(`${API_URL}/api/homepage/`, formData,
            {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
        return res.data;

    } catch (error) {
        console.error('Lỗi khi khi tạo bài', error);
        throw error;
    }

}

//update bài 
export const updateHomepageAdmin = async (id, formData) => {
    try {
        const res = await axios.put(`${API_URL}/api/homepage/${id}`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return res.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật homepage:', error);
        throw error;
    }
}

// xóa bài 
export const deleteHomepageAdmin = async (id) => {

    const res = await axios.delete(`${API_URL}/api/homepage/${id}`)
    return res.data;

}