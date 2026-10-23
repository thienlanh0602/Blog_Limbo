import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

// Lấy token đăng nhập của Admin từ localStorage (nếu có)
const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Hoặc tên key lưu token của bạn
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// 1. Lấy danh sách thư mục và tệp tin theo thư mục hiện tại và mã chia sẻ (nếu có)
export const getDriveContents = async (folderId = null, shareToken = null) => {
    try {
        const params = {};
        if (folderId) params.folderId = folderId;
        if (shareToken) params.shareToken = shareToken;

        const res = await axios.get(`${API_URL}/api/drive/contents`, {
            headers: {
                ...getAuthHeaders()
            },
            params
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu Drive:', error);
        throw error;
    }
};

// 2. Tạo mới một thư mục (Chỉ Admin)
export const createFolder = async (name, parentFolder = null) => {
    try {
        const res = await axios.post(`${API_URL}/api/drive/folder`,
            { name, parentFolder },
            {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error('Lỗi khi tạo thư mục mới:', error);
        throw error;
    }
};

// 3. Upload file lên Cloudinary và lưu DB (Chỉ Admin - Hỗ trợ mọi định dạng)
// LƯU Ý: KHÔNG tự đặt 'Content-Type' ở đây. Để axios/trình duyệt tự gắn
// "multipart/form-data; boundary=..." — nếu đặt tay sẽ mất boundary và multer không đọc được file.
export const uploadDriveFile = async (formData, onProgress) => {
    try {
        const res = await axios.post(`${API_URL}/api/drive/upload`, formData, {
            headers: {
                ...getAuthHeaders()
            },
            onUploadProgress: (e) => {
                if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
            }
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi upload tệp tin:', error);
        throw error;
    }
};

// 4. Tạo đường dẫn chia sẻ (Share Link) cho Thư mục (Chỉ Admin)
export const shareFolder = async (id) => {
    try {
        const res = await axios.post(`${API_URL}/api/drive/folder/${id}/share`, {}, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return res.data; // Trả về { shareToken }
    } catch (error) {
        console.error('Lỗi khi tạo link chia sẻ thư mục:', error);
        throw error;
    }
};

// 5. Xóa hoàn toàn một tệp tin theo ID (Chỉ Admin)
export const deleteDriveFile = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/api/drive/file/${id}`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi xóa tệp tin:', error);
        throw error;
    }
};

// 6. Xóa thư mục (kèm toàn bộ thư mục con + tệp bên trong) (Chỉ Admin)
export const deleteDriveFolder = async (id) => {
    try {
        const res = await axios.delete(`${API_URL}/api/drive/folder/${id}`, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi xóa thư mục:', error);
        throw error;
    }
};

// Đổi tên thư mục
export const renameDriveFolder = async (folderId, name) => {
    try {
        const res = await axios.patch(`${API_URL}/api/drive/folder/${folderId}`, { name }, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi đổi tên thư mục:', error);
        throw error;
    }
};

// Đổi tên tệp tin
export const renameDriveFile = async (fileId, name) => {
    try {
        const res = await axios.patch(`${API_URL}/api/drive/file/${fileId}`, { name }, {
            headers: {
                ...getAuthHeaders()
            }
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi đổi tên tệp tin:', error);
        throw error;
    }
};
