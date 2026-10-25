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

// Cập nhật lại getFileLabel để bắt an toàn trường hợp fileType hoặc định dạng lạ
export const getFileLabel = (file) => {
  if (file?.isExternal) {
    const labels = { word: 'Docs', excel: 'Sheets', powerpoint: 'Slides', drive: 'Drive' };
    return labels[getTypeKey(file, false)] || 'Link';
  }
  const ext = getExt(file);
  if (ext) return ext.toUpperCase().slice(0, 4);
  const typeKey = getTypeKey(file, false);
  return typeKey ? typeKey.toUpperCase().slice(0, 4) : 'FILE';
};

export const getDownloadUrl = (url = '') => url.replace('/upload/', '/upload/fl_attachment/');

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