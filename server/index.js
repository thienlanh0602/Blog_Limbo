const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require("dns");
const https = require('https'); // Dùng để gửi request ping chuẩn HTTPS của Render
const http = require('http');

const authRouter = require('./routers/authRouter');
const homepageRouter = require('./routers/homepageRouter');
const imageRouter = require('./routers/imageRouter');
const musicRouter = require('./routers/musicRouter');
const playlistRouter = require('./routers/playlistRouter');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO_URL = process.env.MONGO_URL;

// Set DNS
dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

// Kết nối MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log("Success connect MongoDB ✅"))
  .catch(err => console.log('Error Connect ❌', err));

// Route cơ bản để kiểm tra trạng thái và phục vụ Self-ping
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Các Route APIs của bạn
app.use('/api/auth', authRouter);
app.use('/api/homepage', homepageRouter);
app.use('/api/image', imageRouter);
app.use('/api/music', musicRouter);
app.use('/api/playlist', playlistRouter);

// Hàm tự động ping để giữ server không bị ngủ đông trên Render
function startKeepAlive() {
  const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;

  if (!RENDER_EXTERNAL_URL) {
    console.log("Đang chạy ở Localhost - Không kích hoạt Self-Ping. 💻");
    return;
  }

  const pingUrl = `${RENDER_EXTERNAL_URL}/ping`;
  const INTERVAL_TIME = 14 * 60 * 1000; // 14 phút (Render ngủ sau 15 phút)

  console.log(`Đã kích hoạt Self-Ping giữ thức đến: ${pingUrl} ⚡`);

  setInterval(() => {
    // Tự động chọn http hoặc https tùy theo URL của Render cung cấp
    const client = pingUrl.startsWith('https') ? https : http;

    client.get(pingUrl, (res) => {
      console.log(`[Keep-Alive] Tự ping thành công lúc ${new Date().toLocaleTimeString()} - Status: ${res.statusCode} ☕`);
    }).on('error', (err) => {
      console.error('[Keep-Alive] Lỗi tự ping:', err.message);
    });
  }, INTERVAL_TIME);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`);
  
  // Khởi động trình tự ping ngay khi server chạy thành công
  startKeepAlive();
});