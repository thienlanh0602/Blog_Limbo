const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

//tao admin 1 tai khoan duy nhat
const creactAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const findUser = await User.findOne({ username });
        if (findUser) {
            return res.status(401).json({ message: 'User da ton tai ❌' });
        }

        const newUser = new User({ username, password });
        await newUser.save()
        res.status(201).json({ message: 'Tao thanh cong user' })
    } catch (err) {
        console.error('❌ Lỗi khi tạo user:', err.message);
        res.status(500).json({ message: 'Lỗi server' });
    }
}
//API dang nhap
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu!!' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({ token });
    } catch (err) {
        console.error("🔥 Lỗi khi đăng nhập: ", err.message);
        res.status(500).json({ message: 'Lỗi server ❌' });
    }

}
const getlogin = (req, res) => {
    res.json({ name: req.user.username });

}
module.exports = { creactAdmin, login, getlogin };