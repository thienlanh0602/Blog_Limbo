const Homepage = require('../models/HomePage')

//lay cac thuoc tinh cua homepage
const getHomePage = async (req, res) => {
    try {
        const homePage = await Homepage.find();
        res.json(homePage)

    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy homepage ❌' });
    }
};

//tao thuoc tinh homepage  
const createHomepage = async (req, res, next) => {
    try {
        const { title, title_2, type } = req.body;

        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const homepage = new Homepage({ title, title_2, type, image: imagePaths });
        await homepage.save();

        return res.status(201).json(homepage);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Không thể tạo homepage ❌' });
    }
};


//update homepage
const updateHomepage = async (req, res) => {
    try {
        const { title, title_2, existingImages } = req.body;
        const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const updateData = {};
        if (title) updateData.title = title;
        if (title_2) updateData.title_2 = title_2;

        let finalImages = [];
        if (Array.isArray(existingImages)) {
            finalImages = finalImages.concat(existingImages);
        } else if (existingImages) {
            finalImages.push(existingImages); // trường hợp chỉ còn 1 ảnh cũ
        }

        finalImages = finalImages.concat(imagePaths);

        updateData.image = finalImages;

        const homePage = await Homepage.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            upsert: true
        });

        res.json(homePage);

    } catch (error) {
        res.status(500).json({ error: 'Không thể cập nhật homepage ❌' });
    }
};

//delete homepage
const deleteElement = async (req, res) => {
    try {
        const del = await Homepage.findByIdAndDelete(req.params.id);
        if (!del) {
            return res.status(404).json({ message: 'Không tìm thấy dữ liệu để xoá' });
        }
        res.status(200).json({ message: 'Đã xoá thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xoá homepage' });
    }
}

module.exports = { getHomePage, createHomepage, updateHomepage, deleteElement }



