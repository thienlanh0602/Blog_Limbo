import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { StarIcon, DotsIcon, FolderIcon, DotSeparatorIcon, FileIcon } from '../icons/DriveIcons';
import { NoFilesIllustration } from './NoFilesIllustration';
import { formatDate, formatBytes, getFileLabel, getTypeKey } from '../utils/driveHelpers';

export const FileTypeIcon = ({ file }) => {
  if (file.fileType?.startsWith('image/')) {
    return (
      <Box
        component="img"
        src={file.url}
        alt={file.name}
        loading="lazy"
        sx={{ width: 48, height: 48, borderRadius: '10px', objectFit: 'cover', display: 'block' }}
      />
    );
  }

  const typeKey = getTypeKey(file, false);
  return <FileIcon type={typeKey} size={48} />;
};

export const DriveItemList = ({
  visibleFolders,
  visibleFiles,
  handleOpenFolder,
  setSelectedPreview,
  isAdmin,
  starredIds,
  toggleStar,
  handleOpenMenu,
  keyword,
  hasFilter,
  C
}) => {
  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 5 }}>
        {visibleFolders.map((f) => (
          <Box
            key={f._id}
            onClick={() => handleOpenFolder(f)}
            sx={{
              position: 'relative', cursor: 'pointer', userSelect: 'none',
              textAlign: 'left',
              p: 2.5, borderRadius: '16px', bgcolor: '#fff',
              border: `1px solid ${C.line}`,
              transition: 'border-color 0.2s ease',
              '&:hover': { borderColor: C.text }
            }}
          >
            {isAdmin && (
              <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={(e) => toggleStar(e, f._id)}
                  sx={{ color: C.textSub, '&:hover': { bgcolor: C.fieldBg } }}
                >
                  <StarIcon filled={starredIds.includes(f._id)} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => handleOpenMenu(e, 'FOLDER', f)}
                  sx={{ color: C.textSub, '&:hover': { bgcolor: C.fieldBg } }}
                >
                  <DotsIcon />
                </IconButton>
              </Box>
            )}

            <FolderIcon />

            <Typography
              title={f.name}
              sx={{
                mt: 2, fontSize: 16, fontWeight: 400,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}
            >
              {f.name}
            </Typography>

            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: 13, color: C.textSub }}>
              <span>{f.storeSize || '0 MB'}</span>
              <DotSeparatorIcon />
              <span>{f.fileCount || 0} file</span>
            </Box>

            <Box sx={{ mt: 0.5, fontSize: 13, color: C.textSub }}>
              {formatDate(f.createdAt)}
            </Box>
          </Box>
        ))}

        {visibleFiles.map((file) => (
          <Box
            key={file._id}
            onClick={() => setSelectedPreview(file)}
            sx={{
              position: 'relative', cursor: 'pointer', userSelect: 'none',
              textAlign: 'left',
              p: 2.5, borderRadius: '16px', bgcolor: '#fff',
              border: `1px solid ${C.line}`,
              transition: 'border-color 0.2s ease',
              '&:hover': { borderColor: C.text }
            }}
          >
            <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isAdmin && (
                <IconButton
                  size="small"
                  onClick={(e) => toggleStar(e, file._id)}
                  sx={{ color: C.textSub, '&:hover': { bgcolor: C.fieldBg } }}
                >
                  <StarIcon filled={starredIds.includes(file._id)} />
                </IconButton>
              )}
              <IconButton
                size="small"
                title="Tùy chọn"
                onClick={(e) => handleOpenMenu(e, 'FILE', file)}
                sx={{ color: C.textSub, '&:hover': { bgcolor: C.fieldBg } }}
              >
                <DotsIcon />
              </IconButton>
            </Box>

            <FileTypeIcon file={file} />

            <Typography
              title={file.name}
              sx={{
                mt: 2, fontSize: 16, fontWeight: 400,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}
            >
              {file.name}
            </Typography>

            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: 13, color: C.textSub }}>
              <span>{formatBytes(file.size)}</span>
              <Box component="span" sx={{ mt: 0.5, width: 2.5, height: 2.5, borderRadius: '50%', bgcolor: '#C4CDD5' }} />
              <span>{getFileLabel(file)}</span>
            </Box>

            <Box sx={{ mt: 0.5, fontSize: 13, color: C.textSub }}>
              {formatDate(file.createdAt)}
            </Box>
          </Box>
        ))}
      </Box>

      {visibleFolders.length === 0 && visibleFiles.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 12 }}>
          <NoFilesIllustration size={280} />
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: C.text, mt: 2 }}>
            {keyword || hasFilter ? 'Không tìm thấy thư mục hoặc tệp phù hợp.' : 'Chưa có tệp tin nào'}
          </Typography>
          <Typography sx={{ fontSize: 14, color: C.textSub, mt: 0.5, mb: 3, fontWeight: 300 }}>
            {keyword || hasFilter
              ? 'Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm của bạn.'
              : isAdmin
                ? 'Bắt đầu bằng cách tạo thư mục mới hoặc tải lên tài liệu của bạn.'
                : 'Thư mục hiện tại đang trống.'}
          </Typography>
        </Box>
      )}
    </>
  );
};