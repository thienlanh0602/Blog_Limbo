const STARRED_KEY = 'drive_starred_folders';

export const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatBytes = (bytes = 0) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / 1024 ** i;
  return `${v >= 10 || i === 0 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
};

export const getExt = (item) => {
  const name = item?.name || '';
  return name.includes('.') ? name.split('.').pop().toLowerCase() : '';
};

export const getTypeKey = (item, isFolder = false) => {
  if (isFolder) return 'folder';
  const mime = item?.fileType || '';
  const ext = getExt(item);

  // Tệp thêm từ link Google: nhận dạng theo loại tài liệu (Docs -> word, Sheets -> excel, Slides -> powerpoint)
  if (item?.isExternal) {
    const t = String(item.externalType || '').toLowerCase();
    if (t.includes('drive') || t.includes('folder')) return 'drive'; // gdrive (tệp Drive), gfolder (thư mục Drive)
    if (t.includes('sheet')) return 'excel';
    if (t.includes('slide') || t.includes('present')) return 'powerpoint';
    if (t.includes('doc')) return 'word';
  }

  if (ext === 'psd' || mime.includes('photoshop')) return 'photoshop';
  if (ext === 'ai' || mime === 'application/illustrator') return 'illustrator';
  if (mime.includes('pdf') || ext === 'pdf') return 'pdf';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (/^(doc|docx)$/.test(ext) || mime.includes('word')) return 'word';
  if (/^(xls|xlsx|csv)$/.test(ext) || mime.includes('sheet') || mime.includes('excel')) return 'excel';
  if (/^(ppt|pptx)$/.test(ext) || mime.includes('presentation') || mime.includes('powerpoint')) return 'powerpoint';
  if (/^(zip|rar|7z)$/.test(ext) || mime.includes('zip') || mime.includes('compressed')) return 'zip';
  if (ext === 'txt' || mime === 'text/plain') return 'txt';
  return 'other';
};

// Nhãn hiển thị định dạng (tệp lạ / không có đuôi thì hiện "FILE")
export const getFileLabel = (file) => {
  if (file?.isExternal) {
    const labels = { word: 'Docs', excel: 'Sheets', powerpoint: 'Slides', drive: 'Drive' };
    return labels[getTypeKey(file, false)] || 'Link';
  }
  const ext = getExt(file);
  if (ext) return ext.toUpperCase().slice(0, 4);
  const typeKey = getTypeKey(file, false);
  return !typeKey || typeKey === 'other' ? 'FILE' : typeKey.toUpperCase().slice(0, 4);
};

export const getDownloadUrl = (url = '') => url.replace('/upload/', '/upload/fl_attachment/');

/* ---------- Tải xuống: giữ đúng tên + đuôi tệp ---------- */

// Đuôi file theo mime, dùng khi tên tệp trong DB bị mất đuôi
const MIME_EXT = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/zip': 'zip',
  'application/x-zip-compressed': 'zip',
  'text/plain': 'txt',
  'text/csv': 'csv',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'audio/mpeg': 'mp3'
};

// Tên file lúc tải về: luôn có đuôi (vd "bao-cao.docx", không phải "file")
export const getDownloadName = (file) => {
  const name = String(file?.name || '').trim() || 'file';
  if (getExt({ name })) return name;

  // Tên không có đuôi: thử lấy theo mime, rồi theo đuôi trong đường dẫn
  let ext = MIME_EXT[file?.fileType] || '';
  if (!ext && file?.url) {
    const last = file.url.split('?')[0].split('/').pop() || '';
    const urlExt = last.includes('.') ? last.split('.').pop().toLowerCase() : '';
    if (/^[a-z0-9]{1,5}$/.test(urlExt)) ext = urlExt;
  }
  return ext ? `${name}.${ext}` : name;
};

// Tải về bằng fetch + blob để ép đúng tên tệp (thuộc tính `download` bị bỏ qua với link khác domain,
// nên trước đây trình duyệt mở tab trống hoặc đặt tên "file")
export const downloadFile = async (file) => {
  if (!file?.url) return;

  // Link Google: không có tệp để tải, mở thẳng liên kết
  if (file.isExternal) {
    window.open(file.url, '_blank', 'noopener,noreferrer');
    return;
  }

  const filename = getDownloadName(file);
  try {
    const res = await fetch(file.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();

    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch (err) {
    // Dự phòng (vd bị chặn CORS): mở link tải của Cloudinary
    console.warn('Tải bằng blob thất bại, chuyển sang link trực tiếp:', err);
    window.open(getDownloadUrl(file.url), '_blank', 'noopener,noreferrer');
  }
};

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
export const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
export const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
export const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
export const isSameDay = (a, b) => Boolean(a) && Boolean(b) && startOfDay(a) === startOfDay(b);

export const saveStarred = (ids) => {
  try {
    localStorage.setItem(STARRED_KEY, JSON.stringify(ids));
  } catch {
    /* bỏ qua */
  }
};