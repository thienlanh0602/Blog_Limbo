import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL;

export const getHomepageAdmin = async () => {
    const res = await axios.get(`${API_URL}/api/homepage/`);
    return res.data;
}
