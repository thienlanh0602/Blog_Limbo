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
        const { title } = req.body;
        // test
        // console.log('req.body:', req.body);       // kiểm tra dữ liệu title
        // console.log('req.file:', req.file);
        // if (!req.file) {
        //     return res.status(400).json({ error: 'Ảnh là bắt buộc' });
        //     next();
        // }
       
        const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
        // console.log("req.file:", req.file);

        const homepage = new Homepage({ title, image: imagePath });
        await homepage.save();

        return res.status(201).json(homepage); // ✅ Đúng là `res`, không phải `req`
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Không thể tạo homepage ❌' });
    }
};


//update homepage
const updateHomepage = async (req, res) => {
    try {
        const { title } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updateData = {};
        if (title) updateData.title = title;
        if (imagePath) updateData.image = imagePath;


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



