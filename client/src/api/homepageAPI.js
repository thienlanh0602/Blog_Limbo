import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL;


//lấy bài viết cho admin
export const getHomepage = async () => {
    const res = await axios.get(`${API_URL}/api/homepage/`);
    return res.data;
}


// chỉnh sửa cho bài viết

