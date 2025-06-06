const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();

const authenticateAdmin = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authentication denied' });
    }

    const token = authHeader.split(' ')[1]; // cắt bỏ 'Bearer'

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // truyền secret vào
        req.user = decoded; // có thể là { id, username, email, role, ... }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token not valid' });
    }
};

module.exports = authenticateAdmin;
