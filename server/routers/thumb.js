const express = require('express');
const router = express.Router();

const FALLBACK_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'>
  <rect width='100%' height='100%' fill='#1a1a1e'/>
  <text x='50%' y='55%' font-size='48' fill='#4efcd3' text-anchor='middle' dominant-baseline='middle'>♪</text>
</svg>`;

// Cache trong RAM: nhớ video nào đã hỏng để khỏi hỏi lại YouTube
const brokenIds = new Map(); // id -> thời điểm hết hạn
const BROKEN_TTL = 60 * 60 * 1000; // 1 giờ

const sendFallback = (res) => {
    res.set('Content-Type', 'image/svg+xml');
    res.set('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(FALLBACK_SVG);
};

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // ID video YouTube luôn gồm 11 ký tự chữ, số, _ hoặc -
    if (!/^[\w-]{11}$/.test(id)) return sendFallback(res);

    const expireAt = brokenIds.get(id);
    if (expireAt && expireAt > Date.now()) return sendFallback(res);

    for (const size of ['hqdefault', 'mqdefault', 'default']) {
        try {
            const r = await fetch(`https://i.ytimg.com/vi/${id}/${size}.jpg`);
            if (r.ok) {
                res.set('Content-Type', r.headers.get('content-type') || 'image/jpeg');
                res.set('Cache-Control', 'public, max-age=604800'); // cache 7 ngày
                return res.send(Buffer.from(await r.arrayBuffer()));
            }
        } catch (e) {
            // lỗi mạng: thử kích thước tiếp theo
        }
    }

    brokenIds.set(id, Date.now() + BROKEN_TTL);
    return sendFallback(res);
});

module.exports = router;