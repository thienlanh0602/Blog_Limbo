import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Menu,
  MenuItem,
  IconButton,
  InputAdornment,
  Divider,
  Tooltip,
  Popover
} from '@mui/material';
import {
  getDriveContents,
  createFolder,
  uploadDriveFile,
  shareFolder,
  deleteDriveFile,
  deleteDriveFolder
} from '../../api/driveAPI';

/* ---------- Design tokens (theo Minimals) ---------- */
const C = {
  text: '#1C252E',
  textSub: '#637381',
  line: 'rgba(145, 158, 171, 0.2)',
  fieldBg: 'rgba(145, 158, 171, 0.08)',
  danger: '#B71D18',
  dangerBg: 'rgba(255, 86, 48, 0.08)',
  errorMain: '#FF5630',
  successMain: '#22C55E'
};
const FONT = '"Public Sans", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif';
const STARRED_KEY = 'drive_starred_folders';

/* ---------- Icon SVG nội bộ (không cần cài thêm thư viện) ---------- */

const NoFilesIllustration = ({ size = 320 }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      {/* Các đường tròn đồng tâm nền */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        style={{ position: 'absolute', inset: 0 }}
      >
        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(145, 158, 171, 0.12)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(145, 158, 171, 0.16)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="65" fill="none" stroke="rgba(145, 158, 171, 0.20)" strokeWidth="1.5" />
      </svg>

      {/* Icon thẻ tệp chính ở giữa (màu xám đậm hơn một chút so với mẫu) */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: 72,
          height: 88,
          bgcolor: '#D5D8DC',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.2)'
        }}
      >
        {/* Góc gập của tệp */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 24,
            height: 24,
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            borderBottomLeftRadius: 12
          }}
        />
        {/* Các dòng chữ minh họa bên trong tệp */}
        <Box sx={{ width: '40px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Box sx={{ height: '3px', bgcolor: '#868E96', borderRadius: '2px', width: '100%' }} />
          <Box sx={{ height: '3px', bgcolor: '#868E96', borderRadius: '2px', width: '75%' }} />
          <Box sx={{ height: '3px', bgcolor: '#868E96', borderRadius: '2px', width: '90%' }} />
        </Box>
      </Box>

      {/* Các thẻ icon nhỏ bay xung quanh (nền xám đậm hơn mẫu tí, icon stroke sắc nét) */}
      {/* 1. Icon thư mục */}
      <Box
        sx={{
          position: 'absolute',
          top: '66%',
          left: '24%',
          zIndex: 2,
          p: 1,
          bgcolor: '#E2E6EA',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </Box>

      {/* 2. Icon tệp văn bản nhỏ trên */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '25%',
          zIndex: 2,
          p: 1,
          bgcolor: '#E2E6EA',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </Box>

      {/* 3. Icon lưới / layout phải */}
      <Box
        sx={{
          position: 'absolute',
          top: '1%',
          right: '24%',
          zIndex: 2,
          p: 1.2,
          bgcolor: '#E2E6EA',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </Box>

      {/* 4. Icon hình ảnh bên phải */}
      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          right: '0%',
          zIndex: 2,
          p: 1,
          bgcolor: '#E2E6EA',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </Box>

      {/* 5. Icon play video dưới phải */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '26%',
          right: '20%',
          zIndex: 2,
          p: 1,
          bgcolor: '#E2E6EA',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" fill="#495057" />
        </svg>
      </Box>

      {/* 6. Icon tệp nhỏ góc dưới trái */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '38%',
          left: '1%',
          zIndex: 2,
          p: 1,
          bgcolor: '#E2E6EA',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </Box>
    </Box>
  );
};
const Svg = ({ children, size = 20, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);
const SearchIcon = () => (
  <Svg size={18} strokeWidth={2.5}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Svg>
);
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
    <defs>
      <mask id="uploadCloudMask">
        <rect width="24" height="24" fill="#fff" />
        <g fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 17v-6.5" />
          <path d="M9.2 13.3L12 10.5l2.8 2.8" />
        </g>
      </mask>
    </defs>
    <path
      mask="url(#uploadCloudMask)"
      d="M7 20a5 5 0 0 1-.9-9.92A6.5 6.5 0 0 1 18.6 9.4 5.3 5.3 0 0 1 17.5 20H7z"
    />
  </svg>
);

const FolderPlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
    <defs>
      <mask id="folderPlusMask">
        <rect width="24" height="24" fill="#fff" />
        <g fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
          <path d="M12 11.5v6" />
          <path d="M9 14.5h6" />
        </g>
      </mask>
    </defs>
    <path
      mask="url(#folderPlusMask)"
      d="M3 7a2 2 0 0 1 2-2h4.2a2 2 0 0 1 1.5.7L12.3 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
    />
  </svg>
);

const DotsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" />
  </svg>
);

/* Thư mục vàng */
const FolderIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="4 8 40 34" style={{ display: 'block', flexShrink: 0 }}>
    <path d="M4 12a4 4 0 014-4h10.2a4 4 0 012.9 1.2L24 12h16a4 4 0 014 4v22a4 4 0 01-4 4H8a4 4 0 01-4-4V12z" fill="#FFD666" />
    <path d="M4 20a4 4 0 014-4h32a4 4 0 014 4v18a4 4 0 01-4 4H8a4 4 0 01-4-4V20z" fill="#FFAB00" />
  </svg>
);

const FolderOpenIcon = () => (<Svg><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v1H3V7z" /><path d="M3 10h18l-1.6 7.2A2 2 0 0117.45 19H5.2a2 2 0 01-2-1.7L3 10z" /></Svg>);
const LinkIcon = () => (<Svg><path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1-1" /></Svg>);
const EyeIcon = () => (<Svg><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Svg>);
const DownloadIcon = () => (<Svg><path d="M12 4v12" /><path d="M7 11l5 5 5-5" /><path d="M4 20h16" /></Svg>);
const TrashIcon = () => (<Svg><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></Svg>);
const CopyIcon = () => (
  <Svg>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 012-2h9" />
  </Svg>
);

/* Ngôi sao gắn dấu thư mục */
const StarIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? '#FFAB00' : 'none'} stroke={filled ? '#FFAB00' : 'currentColor'}
    strokeWidth="2" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
  </svg>
);

/* Vương miện vàng */
const CrownIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" style={{ display: 'block' }}>
    <defs>
      <linearGradient id="crownGold" x1="12" y1="4" x2="12" y2="19" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFD666" />
        <stop offset="1" stopColor="#FFAB00" />
      </linearGradient>
    </defs>
    <path
      d="M4.2 8.6l3.5 3.3L12 5.6l4.3 6.3 3.5-3.3-1.5 8.4H5.7L4.2 8.6z"
      fill="url(#crownGold)" stroke="url(#crownGold)" strokeWidth="1.2" strokeLinejoin="round"
    />
    <circle cx="3.6" cy="7.4" r="1.5" fill="#FFAB00" />
    <circle cx="12" cy="4.6" r="1.5" fill="#FFAB00" />
    <circle cx="20.4" cy="7.4" r="1.5" fill="#FFAB00" />
    <rect x="5.2" y="18.6" width="13.6" height="2.4" rx="1.2" fill="#B76E00" />
    <circle cx="12" cy="13.6" r="1.3" fill="#FFF5CC" />
  </svg>
);

/* Người ẩn danh */
const GuestIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path
      d="M7.4 4.6A2 2 0 019.3 3.2h5.4a2 2 0 011.9 1.4L18 9.4H6l1.4-4.8z"
      fill="#637381"
    />
    <rect x="2.5" y="9.4" width="19" height="2.2" rx="1.1" fill="#637381" />
    <circle cx="7.6" cy="16.4" r="3.1" fill="none" stroke="#637381" strokeWidth="2" />
    <circle cx="16.4" cy="16.4" r="3.1" fill="none" stroke="#637381" strokeWidth="2" />
    <path d="M10.6 15.8c.9-.7 1.9-.7 2.8 0" fill="none" stroke="#637381" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/* ---------- ĐỊNH NGHĨA 11 SVG CHO CÁC ĐỊNH DẠNG TỆP TIN ---------- */
const FILE_STYLES = {
  txt: {
    label: 'TXT',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#919EAB" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#919EAB" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#637381" />
        <text x="18" y="34.4" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="9.5" fontWeight="800">TXT</text>
      </svg>
    )
  },
  zip: {
    label: 'ZIP',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#FFAB00" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#FFAB00" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#FFAB00" />
        <text x="18" y="34.4" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="9.5" fontWeight="800">ZIP</text>
      </svg>
    )
  },
  audio: {
    label: 'AUDIO',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#8E33FF" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#8E33FF" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#8E33FF" />
        <path d="M19.6 33.6V27l6.6-1.7v6.8" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17.7" cy="33.8" r="2" fill="#fff" />
        <circle cx="24.3" cy="32.2" r="2" fill="#fff" />
      </svg>
    )
  },
  image: {
    label: 'IMG',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#22C55E" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#22C55E" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#22C55E" />
        <path d="M9.5 35.5l5.2-6.6 3.6 4.3 2.7-3.2 5.5 5.5z" fill="#fff" />
        <circle cx="24.2" cy="27.6" r="1.5" fill="#fff" />
      </svg>
    )
  },
  video: {
    label: 'VIDEO',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#FF5630" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#FF5630" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#FF5630" />
        <path d="M15.2 26.6v8.8l7.8-4.4z" fill="#fff" />
      </svg>
    )
  },
  word: {
    label: 'DOC',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#2065D1" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#2065D1" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#2065D1" />
        <text x="18" y="34.4" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="9.5" fontWeight="800">DOC</text>
      </svg>
    )
  },
  excel: {
    label: 'XLS',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#118D57" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#118D57" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#118D57" />
        <text x="18" y="34.4" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="9.5" fontWeight="800">XLS</text>
      </svg>
    )
  },
  powerpoint: {
    label: 'PPT',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#FF6C40" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#FF6C40" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#FF6C40" />
        <text x="18" y="34.4" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="9.5" fontWeight="800">PPT</text>
      </svg>
    )
  },
  pdf: {
    label: 'PDF',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#FF3030" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#FF3030" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#FF3030" />
        <text x="18" y="34.4" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="9.5" fontWeight="800">PDF</text>
      </svg>
    )
  },
  photoshop: {
    label: 'PSD',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#0077C8" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#0077C8" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#0077C8" />
        <text x="18" y="34.4" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="9.5" fontWeight="800">PSD</text>
      </svg>
    )
  },
  illustrator: {
    label: 'AI',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#FF9A00" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#FF9A00" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#FF9A00" />
        <text x="18" y="34.4" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="9.5" fontWeight="800">AI</text>
      </svg>
    )
  },
  other: {
    label: 'FILE',
    svg: (size) => (
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block', flexShrink: 0 }}>
        <path d="M12 3h18l11 11v29a2 2 0 01-2 2H12a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#919EAB" fillOpacity="0.2" />
        <path d="M30 3v9a2 2 0 002 2h9L30 3z" fill="#919EAB" fillOpacity="0.5" />
        <rect x="3" y="23" width="30" height="16" rx="3.5" fill="#919EAB" />
        <text x="18" y="34.4" textAnchor="middle" fill="#fff" fontFamily={FONT} fontSize="8" fontWeight="800">FILE</text>
      </svg>
    )
  }
};

const FileIcon = ({ type = 'other', size = 48 }) => {
  const s = FILE_STYLES[type] || FILE_STYLES.other;
  return s.svg(size);
};

/* ---------- Hàm tiện ích ---------- */
const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / 1024 ** i;
  return `${v >= 10 || i === 0 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
};

const getExt = (item) => (item.name?.includes('.') ? item.name.split('.').pop() : '').toLowerCase();

const getTypeKey = (item, isFolder = false) => {
  if (isFolder) return 'folder';
  const mime = item.fileType || '';
  const ext = getExt(item);
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

const getFileLabel = (file) =>
  getExt(file).toUpperCase().slice(0, 4) || FILE_STYLES[getTypeKey(file)].label;

const getDownloadUrl = (url = '') => url.replace('/upload/', '/upload/fl_attachment/');

const FileTypeIcon = ({ file }) => {
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
  return <FileIcon type={getTypeKey(file)} size={48} />;
};

const menuPaperSx = {
  mt: 0.5, p: 0.5, minWidth: 190, borderRadius: '10px', backgroundImage: 'none',
  boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.24), -20px 20px 40px -4px rgba(145, 158, 171, 0.24)'
};
const menuItemSx = {
  gap: 2, px: 1, minHeight: 36, borderRadius: '6px',
  fontFamily: FONT, fontSize: 14, fontWeight: 500, color: C.text,
  '& svg': { flexShrink: 0 },
  '&:hover': { bgcolor: C.fieldBg }
};
const menuItemDangerSx = {
  ...menuItemSx,
  color: C.danger,
  '&:hover': { bgcolor: C.dangerBg }
};

const modalBoxSx = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper', boxShadow: 0, p: 4, borderRadius: 2
};

const dialogBoxSx = {
  ...modalBoxSx, p: 3, borderRadius: '16px',
  boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.24), -20px 20px 40px -4px rgba(145, 158, 171, 0.24)'
};

const keepBtnVisible = (bg, hoverBg, color) => ({
  opacity: 1,
  visibility: 'visible',
  '&:focus, &:focus-visible, &:active': { bgcolor: bg, color, outline: 'none', opacity: 1, visibility: 'visible' },
  '&:hover, &:hover:focus, &:hover:active': { bgcolor: hoverBg, color }
});

const headerBtnSx = {
  flexShrink: 0, height: 40, px: { xs: 1.5, sm: 2 }, minWidth: { xs: 40, sm: 'auto' }, width: { xs: 40, sm: 'auto' }, borderRadius: '8px', textTransform: 'none',
  fontFamily: FONT, fontWeight: 700, fontSize: 14,
  bgcolor: C.text, color: '#fff',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  '& .MuiButton-startIcon': { margin: { xs: 0, sm: '0 8px 0 -4px' } },
  ...keepBtnVisible(C.text, '#454F5B', '#fff'),
  '&.Mui-disabled': { bgcolor: C.fieldBg, color: C.textSub }
};

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const isSameDay = (a, b) => Boolean(a) && Boolean(b) && startOfDay(a) === startOfDay(b);

const ChevronDownIcon = () => (<Svg size={16} strokeWidth={2.5}><path d="M6 9l6 6 6-6" /></Svg>);
const ChevronLeftIcon = () => (<Svg size={20} strokeWidth={2.5}><path d="M15 6l-6 6 6 6" /></Svg>);
const ChevronRightIcon = ({ size = 20, strokeWidth = 2.5 }) => (
  <Svg size={size} strokeWidth={strokeWidth}><path d="M9 6l6 6-6 6" /></Svg>
);

/* Danh sách loại để lọc */
const FILTER_TYPES = [
  { key: 'folder', label: 'Thư mục' },
  { key: 'txt', label: 'Txt' },
  { key: 'zip', label: 'Zip' },
  { key: 'audio', label: 'Âm thanh' },
  { key: 'image', label: 'Hình ảnh' },
  { key: 'video', label: 'Video' },
  { key: 'word', label: 'Word' },
  { key: 'excel', label: 'Excel' },
  { key: 'powerpoint', label: 'Powerpoint' },
  { key: 'pdf', label: 'Pdf' },
  { key: 'photoshop', label: 'Photoshop' },
  { key: 'illustrator', label: 'Illustrator' }
];

const TypeBadge = ({ type }) =>
  type === 'folder' ? <FolderIcon size={32} /> : <FileIcon type={type} size={32} />;

const FilterButton = ({ label, onClick, active }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.75,
      height: 40, px: 1.5, border: 'none', borderRadius: '8px',
      bgcolor: active ? C.fieldBg : 'transparent',
      color: C.text, fontFamily: FONT, fontSize: 14, fontWeight: 700,
      cursor: 'pointer', whiteSpace: 'nowrap',
      '&:hover': { bgcolor: C.fieldBg }
    }}
  >
    {label}
    <ChevronDownIcon />
  </Box>
);

const outlineBtnSx = {
  height: 36, px: 2, borderRadius: '8px', textTransform: 'none',
  fontFamily: FONT, fontWeight: 700, fontSize: 14,
  color: C.text, border: `1px solid ${C.line}`, bgcolor: '#fff',
  ...keepBtnVisible('#fff', C.fieldBg, C.text)
};
const darkBtnSx = {
  height: 36, px: 2, borderRadius: '8px', textTransform: 'none',
  fontFamily: FONT, fontWeight: 700, fontSize: 14,
  bgcolor: C.text, color: '#fff', boxShadow: 'none',
  ...keepBtnVisible(C.text, '#454F5B', '#fff'),
  '&:hover': { boxShadow: 'none' }
};
const dangerBtnSx = {
  ...darkBtnSx,
  bgcolor: C.errorMain,
  ...keepBtnVisible(C.errorMain, C.danger, '#fff'),
  '&.Mui-disabled': { bgcolor: C.dangerBg, color: C.danger }
};

const WEEKDAYS = ['T', 'T', 'T', 'T', 'T', 'T', 'C'];
const RANGE_BG = 'rgba(145, 158, 171, 0.16)';

const CalendarMonth = ({ month, start, end, onPick, onPrev, onNext }) => {
  const y = month.getFullYear();
  const m = month.getMonth();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7;
  const total = new Date(y, m + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: total }, (_, i) => new Date(y, m, i + 1))
  ];
  const today = new Date();
  const hasRange = Boolean(start) && Boolean(end) && !isSameDay(start, end);

  return (
    <Box sx={{ flex: '1 1 300px', minWidth: 0, p: 2.5, borderRadius: '16px', border: `1px dashed ${C.line}` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontFamily: FONT, fontSize: 16, fontWeight: 600 }}>
          tháng {m + 1} {y}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={onPrev} sx={{ color: C.text }}><ChevronLeftIcon /></IconButton>
          <IconButton size="small" onClick={onNext} sx={{ color: C.text }}><ChevronRightIcon /></IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 0.5 }}>
        {WEEKDAYS.map((w, i) => (
          <Box key={i} sx={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: C.textSub, py: 1 }}>{w}</Box>
        ))}

        {cells.map((d, i) => {
          if (!d) return <Box key={`e${i}`} />;
          const isStart = isSameDay(d, start);
          const isEnd = isSameDay(d, end);
          const selected = isStart || isEnd;
          const t = startOfDay(d);
          const inRange = hasRange && t > startOfDay(start) && t < startOfDay(end);

          let bg = 'transparent';
          if (inRange) bg = RANGE_BG;
          else if (hasRange && isStart) bg = `linear-gradient(to right, transparent 50%, ${RANGE_BG} 50%)`;
          else if (hasRange && isEnd) bg = `linear-gradient(to left, transparent 50%, ${RANGE_BG} 50%)`;

          return (
            <Box key={d.getDate()} sx={{ display: 'flex', justifyContent: 'center', background: bg }}>
              <Box
                component="button"
                type="button"
                onClick={() => onPick(d)}
                sx={{
                  width: 36, height: 36, p: 0, borderRadius: '50%',
                  border: !selected && isSameDay(d, today) ? `1px solid ${C.text}` : 'none',
                  bgcolor: selected ? C.text : 'transparent',
                  color: selected ? '#fff' : C.text,
                  fontFamily: FONT, fontSize: 14, fontWeight: selected ? 700 : 400,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: selected ? C.text : C.fieldBg }
                }}
              >
                {d.getDate()}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const TOP_BLUR_HEIGHT = 200;
const TOP_BLUR_LAYERS = [
  { blur: 12, mask: 'linear-gradient(to bottom, #000 0%, #000 20%, transparent 45%)' },
  { blur: 6, mask: 'linear-gradient(to bottom, #000 10%, #000 35%, transparent 65%)' },
  { blur: 3, mask: 'linear-gradient(to bottom, #000 25%, #000 50%, transparent 80%)' },
  { blur: 1, mask: 'linear-gradient(to bottom, #000 40%, transparent 100%)' }
];

const TopBlur = ({ visible }) => (
  <Box
    aria-hidden
    sx={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: TOP_BLUR_HEIGHT,
      zIndex: 1000,
      pointerEvents: 'none',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.25s ease'
    }}
  >
    {TOP_BLUR_LAYERS.map(({ blur, mask }, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute', inset: 0,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          maskImage: mask,
          WebkitMaskImage: mask
        }}
      />
    ))}
  </Box>
);

const ToastIcon = ({ type }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" fill={type === 'error' ? C.errorMain : C.successMain} />
    {type === 'error' ? (
      <g stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
        <path d="M12 7.5v5.5" />
        <path d="M12 16.4v.1" />
      </g>
    ) : (
      <path d="M7.6 12.4l3 3 5.8-6.2" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

const Toast = ({ open, type, message, onClose }) => (
  <Box
    role="status"
    aria-live="polite"
    onClick={onClose}
    sx={{
      position: 'fixed', left: '50%', bottom: 24, zIndex: 2000,
      display: 'flex', alignItems: 'center', gap: 1.5,
      minWidth: 240, maxWidth: 'min(480px, 92vw)', px: 2, py: 1.5,
      borderRadius: '12px', bgcolor: '#fff', color: C.text,
      boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.24), 0 12px 24px -4px rgba(145, 158, 171, 0.24)',
      fontFamily: FONT, fontSize: 14, fontWeight: 600, lineHeight: 1.5, whiteSpace: 'pre-line',
      cursor: 'pointer',
      opacity: open ? 1 : 0,
      visibility: open ? 'visible' : 'hidden',
      pointerEvents: open ? 'auto' : 'none',
      transform: open ? 'translate(-50%, 0)' : 'translate(-50%, 24px)',
      transition: 'opacity 0.25s ease, transform 0.25s ease, visibility 0.25s'
    }}
  >
    <ToastIcon type={type} />
    <span>{message}</span>
  </Box>
);

const saveStarred = (ids) => {
  try {
    localStorage.setItem(STARRED_KEY, JSON.stringify(ids));
  } catch {
    /* bỏ qua */
  }
};

const DrivePage = () => {
  const [items, setItems] = useState({ folders: [], files: [], role: '' });
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folderHistory, setFolderHistory] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [menu, setMenu] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadState, setUploadState] = useState(null);

  const [starredIds, setStarredIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STARRED_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [selectedPreview, setSelectedPreview] = useState(null);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [shareLinkModal, setShareLinkModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ open: false, type: 'success', message: '' });
  const toastTimer = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showToast = (message, type = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ open: true, type, message });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, open: false })),
      type === 'error' ? 5000 : 3000
    );
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [draftRange, setDraftRange] = useState({ start: null, end: null });
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [leftMonth, setLeftMonth] = useState(() => startOfMonth(new Date()));
  const [rightMonth, setRightMonth] = useState(() => addMonths(new Date(), 1));
  const [typeFilter, setTypeFilter] = useState([]);
  const [draftTypes, setDraftTypes] = useState([]);
  const [typeAnchor, setTypeAnchor] = useState(null);

  const handleOpenDate = () => {
    setDraftRange(dateRange);
    const base = dateRange.start ? startOfMonth(dateRange.start) : startOfMonth(new Date());
    setLeftMonth(base);
    setRightMonth(addMonths(base, 1));
    setIsDateOpen(true);
  };

  const handlePickDay = (d) => {
    setDraftRange(({ start, end }) => {
      if (!start || end) return { start: d, end: null };
      if (startOfDay(d) < startOfDay(start)) return { start: d, end: start };
      return { start, end: d };
    });
  };

  const handleApplyDate = () => {
    const { start } = draftRange;
    const end = draftRange.end || start;
    setDateRange(start ? { start, end } : { start: null, end: null });
    setIsDateOpen(false);
  };

  const handleOpenType = (e) => {
    setDraftTypes(typeFilter);
    setTypeAnchor(e.currentTarget);
  };
  const toggleDraftType = (key) =>
    setDraftTypes((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  const handleApplyType = () => {
    setTypeFilter(draftTypes);
    setTypeAnchor(null);
  };

  const queryParams = new URLSearchParams(window.location.search);
  const shareToken = queryParams.get('shareToken');
  const isAdmin = items.role === 'ADMIN';
  const isUploading = Boolean(uploadState);
  const rootName = shareToken ? (items.shareRoot?.name || 'Thư mục chia sẻ') : 'Folder';

  const loadData = async (folderId = null) => {
    try {
      setError('');
      const data = await getDriveContents(folderId, shareToken);
      setItems(data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Bạn không có quyền truy cập');
      } else {
        setError('Có lỗi xảy ra khi tải dữ liệu Drive');
      }
    }
  };

  useEffect(() => {
    setSearch('');
    loadData(currentFolderId);
  }, [currentFolderId]);

  const handleOpenMenu = (e, type, target) => {
    e.stopPropagation();
    if (type === 'FOLDER' && !isAdmin) return;
    setMenu({ anchorEl: e.currentTarget, type, target });
  };

  const handleCloseMenu = () => setMenu((m) => (m ? { ...m, anchorEl: null } : m));

  const toggleStar = (e, id) => {
    e.stopPropagation();
    setStarredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveStarred(next);
      return next;
    });
  };

  const handleOpenFolder = (folder) => {
    setFolderHistory([...folderHistory, { id: folder._id, name: folder.name }]);
    setCurrentFolderId(folder._id);
    handleCloseMenu();
  };

  const handleNavigateToIndex = (index) => {
    if (index === -1) {
      setFolderHistory([]);
      setCurrentFolderId(null);
    } else {
      const targetHistory = folderHistory.slice(0, index + 1);
      const targetFolder = targetHistory[targetHistory.length - 1];
      setFolderHistory(targetHistory);
      setCurrentFolderId(targetFolder.id);
    }
  };

  const handleCreateFolderSubmit = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName, currentFolderId);
      setNewFolderName('');
      setIsCreateFolderOpen(false);
      loadData(currentFolderId);
      showToast('Đã tạo thư mục');
    } catch (err) {
      showToast(err.response?.data?.message || 'Tạo thư mục thất bại!', 'error');
    }
  };

  const handleCloseCreateFolder = () => {
    setIsCreateFolderOpen(false);
    setNewFolderName('');
  };

  const handleFileUpload = async (e) => {
    const input = e.target;
    const files = Array.from(input.files || []);
    if (files.length === 0) return;

    const failed = [];
    try {
      for (let i = 0; i < files.length; i++) {
        setUploadState({ current: i + 1, total: files.length, percent: 0 });

        const formData = new FormData();
        formData.append('file', files[i]);
        if (currentFolderId) formData.append('folderId', currentFolderId);

        try {
          await uploadDriveFile(formData, (percent) =>
            setUploadState({ current: i + 1, total: files.length, percent })
          );
        } catch (err) {
          failed.push(`${files[i].name}: ${err.response?.data?.message || 'Upload thất bại'}`);
        }
      }
    } finally {
      setUploadState(null);
      input.value = '';
      loadData(currentFolderId);
    }

    if (failed.length > 0) {
      showToast(`Không tải lên được ${failed.length}/${files.length} tệp\n${failed.slice(0, 3).join('\n')}`, 'error');
    } else {
      showToast(`Đã tải lên ${files.length} tệp`);
    }
  };

  const handleAskDelete = (kind, item) => {
    handleCloseMenu();
    setDeleteTarget({ kind, item });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { kind, item } = deleteTarget;
    setIsDeleting(true);
    try {
      if (kind === 'FOLDER') await deleteDriveFolder(item._id);
      else await deleteDriveFile(item._id);

      setStarredIds((prev) => {
        const next = prev.filter((id) => id !== item._id);
        saveStarred(next);
        return next;
      });
      setDeleteTarget(null);
      loadData(currentFolderId);
      showToast(kind === 'FOLDER' ? 'Đã xóa thư mục' : 'Đã xóa tệp tin');
    } catch (err) {
      showToast(
        err.response?.data?.message || (kind === 'FOLDER' ? 'Xóa thư mục thất bại!' : 'Xóa tệp thất bại!'),
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShareFolder = async (folderId) => {
    try {
      const res = await shareFolder(folderId);
      const fullLink = `${window.location.origin}${window.location.pathname}?shareToken=${res.shareToken}`;
      setShareLinkModal(fullLink);
      handleCloseMenu();
    } catch {
      showToast('Không thể tạo link chia sẻ!', 'error');
    }
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLinkModal);
      showToast('Đã sao chép liên kết');
    } catch {
      showToast('Không thể sao chép, hãy chọn liên kết và sao chép thủ công', 'error');
    }
  };

  const crumbs = [
    { id: 'root', name: rootName, index: -1 },
    ...folderHistory.map((h, i) => ({ id: h.id, name: h.name, index: i }))
  ];

  const keyword = search.trim().toLowerCase();
  const hasFilter = Boolean(dateRange.start) || typeFilter.length > 0;

  const inDateRange = (value) => {
    if (!dateRange.start) return true;
    const t = new Date(value).getTime();
    if (isNaN(t)) return false;
    return t >= startOfDay(dateRange.start) && t <= endOfDay(dateRange.end || dateRange.start);
  };
  const matchType = (item, isFolder) =>
    typeFilter.length === 0 || typeFilter.includes(getTypeKey(item, isFolder));

  const filteredFolders = (items.folders || []).filter(
    (f) => (!keyword || f.name.toLowerCase().includes(keyword)) && matchType(f, true) && inDateRange(f.createdAt)
  );
  const filteredFiles = (items.files || []).filter(
    (f) => (!keyword || f.name.toLowerCase().includes(keyword)) && matchType(f, false) && inDateRange(f.createdAt)
  );

  const dateLabel = dateRange.start
    ? (isSameDay(dateRange.start, dateRange.end)
      ? formatDate(dateRange.start)
      : `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`)
    : 'Chọn ngày';
  const typeLabel = typeFilter.length === 0
    ? 'Tất cả loại'
    : typeFilter.length === 1
      ? FILTER_TYPES.find((t) => t.key === typeFilter[0])?.label
      : `${typeFilter.length} loại`;

  const byStarred = (a, b) =>
    Number(starredIds.includes(b._id)) - Number(starredIds.includes(a._id));
  const visibleFolders = [...filteredFolders].sort(byStarred);
  const visibleFiles = [...filteredFiles].sort(byStarred);

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: '120px', fontFamily: FONT }}>
        <Typography variant="h5" color="error" gutterBottom>⚠️ {error}</Typography>
        <Typography variant="body1">Trang này là Blog cá nhân. Vui lòng đăng nhập quyền Admin hoặc sử dụng đường dẫn chia sẻ hợp lệ.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '90%',
        textAlign: 'left',
        minHeight: 'calc(100vh - 140px)',
        px: { xs: 2, md: 15 },
        py: 3,
        boxSizing: 'border-box',
        mt: '70px',
        mb: '50px',
        fontFamily: FONT,
        color: C.text
      }}
    >
      <TopBlur visible={isScrolled} />

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Typography component="h1" sx={{ fontFamily: FONT, fontSize: { xs: 22, md: 26 }, fontWeight: 700, lineHeight: 1.3 }}>
            File manager
          </Typography>
          {isAdmin ? (
            <Tooltip
              arrow={false} 
                
            >
              {/* Thẻ bọc icon hoặc nút của bạn ở đây */}
              <IconButton size="small" sx={{ color: C.textSub }}>
                <CrownIcon />
              </IconButton>
            </Tooltip>
          ) : shareToken ? (
            <Tooltip arrow>
              <Box component="span" sx={{ display: 'inline-flex', cursor: 'default' }}>
                <GuestIcon />
              </Box>
            </Tooltip>
          ) : null}
        </Box>

        {isAdmin ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            {/* 1. Nút "Tạo thư mục": Ẩn chữ trên điện thoại, giữ icon, thêm tooltip */}
           
              <Button
                onClick={() => setIsCreateFolderOpen(true)}
                startIcon={<FolderPlusIcon />}
                sx={headerBtnSx}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Tạo thư mục
                </Box>
              </Button>

            {/* 1. Nút "Tải lên": Ẩn chữ trên điện thoại, giữ icon, thêm tooltip */}
            
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                startIcon={<UploadIcon />}
                sx={headerBtnSx}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {isUploading
                    ? `Đang tải ${uploadState.current}/${uploadState.total} · ${uploadState.percent}%`
                    : 'Tải lên'}
                </Box>
              </Button>
          </Box>
        ) : shareToken ? (
          <Button
            disabled
            disableRipple
            startIcon={<EyeIcon />}
            sx={{
              flexShrink: 0, height: 40, px: 2, borderRadius: '8px', textTransform: 'none',
              fontFamily: FONT, fontWeight: 700, fontSize: 14,
              '&.Mui-disabled': { bgcolor: C.fieldBg, color: C.textSub }
            }}
          >
            Chỉ xem
          </Button>
        ) : null}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {/* 2. Thanh điều hướng folder: font size nhỏ lại trên điện thoại */}
        <Box
          component="nav"
          aria-label="Đường dẫn thư mục"
          sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, minWidth: 0, fontFamily: FONT, fontSize: { xs: 14, md: 18 } }}
        >
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <React.Fragment key={crumb.id}>
                {i > 0 && (
                  <Box component="span" aria-hidden="true" sx={{ display: 'inline-flex', color: C.textSub }}>
                    <ChevronRightIcon size={16} strokeWidth={2} />
                  </Box>
                )}
                <Box
                  component="span"
                  title={crumb.name}
                  role={isLast ? undefined : 'button'}
                  tabIndex={isLast ? -1 : 0}
                  aria-current={isLast ? 'page' : undefined}
                  onClick={() => !isLast && handleNavigateToIndex(crumb.index)}
                  onKeyDown={(e) => { if (!isLast && e.key === 'Enter') handleNavigateToIndex(crumb.index); }}
                  sx={{
                    maxWidth: { xs: 120, md: 240 },
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    fontWeight: isLast ? 700 : 500,
                    color: isLast ? C.text : C.textSub,
                    cursor: isLast ? 'default' : 'pointer',
                    '&:hover': isLast ? {} : { color: C.text, textDecoration: 'underline' }
                  }}
                >
                  {crumb.name}
                </Box>
              </React.Fragment>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
          <FilterButton label={dateLabel} active={Boolean(dateRange.start)} onClick={handleOpenDate} />
          <FilterButton label={typeLabel} active={typeFilter.length > 0} onClick={handleOpenType} />
          {/* 3. Thanh tìm kiếm: To lên chiều ngang phù hợp với màn hình, bằng kích thước chiều ngang của file hay folder nếu ở kích thước điện thoại */}
          <TextField
            placeholder="Tìm kiếm..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: C.textSub }}>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            sx={{
              width: { xs: '100%', sm: 260 },
              px: { xs: '1px', sm: 0 },
              mx: { xs: '1px', sm: 0 },
              '& .MuiOutlinedInput-root': {
                height: 40,
                ml: { xs: 0, sm: 1.5 },
                borderRadius: '8px',
                fontFamily: FONT,
                fontSize: 14,
                '& fieldset': { borderColor: C.line },
                '&:hover fieldset': { borderColor: C.text },
                '&.Mui-focused fieldset': { borderColor: C.text, borderWidth: 1.5 }
              }
            }}
          />
        </Box>
      </Box>

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
                  title={starredIds.includes(f._id) ? 'Bỏ gắn sao' : 'Gắn sao'}
                  onClick={(e) => toggleStar(e, f._id)}
                  sx={{ color: C.textSub, '&:hover': { bgcolor: C.fieldBg } }}
                >
                  <StarIcon filled={starredIds.includes(f._id)} />
                </IconButton>
                <IconButton
                  size="small"
                  title="Tùy chọn"
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
                fontFamily: FONT, mt: 2, fontSize: 16, fontWeight: 600,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}
            >
              {f.name}
            </Typography>

            <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: 13, color: C.textSub }}>
              <span>{f.storeSize || '0 MB'}</span>
              <Box component="span" sx={{ mt: 0.5, width: 2.5, height: 2.5, borderRadius: '50%', bgcolor: '#C4CDD5' }} />
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
                  title={starredIds.includes(file._id) ? 'Bỏ gắn sao' : 'Gắn sao'}
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
                fontFamily: FONT, mt: 2, fontSize: 16, fontWeight: 600,
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
          <Typography sx={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.text, mt: 2 }}>
            {keyword || hasFilter ? 'Không tìm thấy thư mục hoặc tệp phù hợp.' : 'Chưa có tệp tin nào'}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: 14, color: C.textSub, mt: 0.5, mb: 3 }}>
            {keyword || hasFilter
              ? 'Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm của bạn.'
              : isAdmin
                ? 'Bắt đầu bằng cách tạo thư mục mới hoặc tải lên tài liệu của bạn.'
                : 'Thư mục hiện tại đang trống.'}
          </Typography>
        </Box>
      )}

      <Modal
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(2px) !important',
            WebkitBackdropFilter: 'blur(2px) !important',
            bgcolor: 'rgba(123, 136, 149, 0.3)'
          }
        }}
        disableScrollLock open={isDateOpen} onClose={() => setIsDateOpen(false)}>
        <Box sx={{ ...modalBoxSx, width: 'min(860px, 94vw)', maxHeight: '92vh', overflowY: 'auto', p: 3 }}>
          <Typography sx={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, mb: 3 }}>
            Chọn khoảng ngày
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
            <CalendarMonth
              month={leftMonth}
              start={draftRange.start}
              end={draftRange.end}
              onPick={handlePickDay}
              onPrev={() => setLeftMonth((m) => addMonths(m, -1))}
              onNext={() => setLeftMonth((m) => addMonths(m, 1))}
            />
            <CalendarMonth
              month={rightMonth}
              start={draftRange.start}
              end={draftRange.end}
              onPick={handlePickDay}
              onPrev={() => setRightMonth((m) => addMonths(m, -1))}
              onNext={() => setRightMonth((m) => addMonths(m, 1))}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 3 }}>
            <Button
              onClick={() => setDraftRange({ start: null, end: null })}
              disabled={!draftRange.start}
              sx={{ ...outlineBtnSx, px: 2.5 }}
            >
              Xóa chọn
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => setIsDateOpen(false)} sx={outlineBtnSx}>Hủy</Button>
              <Button onClick={handleApplyDate} sx={darkBtnSx}>Áp dụng</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Popover
        open={Boolean(typeAnchor)}
        anchorEl={typeAnchor}
        onClose={() => setTypeAnchor(null)}
        disableScrollLock
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1, p: 2, width: 'min(560px, 92vw)', borderRadius: '16px', backgroundImage: 'none',
            boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.24), -20px 20px 40px -4px rgba(145, 158, 171, 0.24)'
          }
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
          {FILTER_TYPES.map((t) => {
            const active = draftTypes.includes(t.key);
            return (
              <Box
                key={t.key}
                component="button"
                type="button"
                onClick={() => toggleDraftType(t.key)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25, minWidth: 0,
                  borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                  border: active ? `1px solid ${C.text}` : `1px dashed ${C.line}`,
                  bgcolor: active ? C.fieldBg : '#fff',
                  color: C.text, fontFamily: FONT, fontSize: 14, fontWeight: 500,
                  '&:hover': { bgcolor: C.fieldBg }
                }}
              >
                <TypeBadge type={t.key} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.label}</span>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
          <Button onClick={() => setDraftTypes([])} sx={outlineBtnSx}>Xóa</Button>
          <Button onClick={handleApplyType} sx={darkBtnSx}>Áp dụng</Button>
        </Box>
      </Popover>

      <Menu
        open={Boolean(menu?.anchorEl)}
        anchorEl={menu?.anchorEl}
        onClose={handleCloseMenu}
        disableScrollLock
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: menuPaperSx }}
        MenuListProps={{ sx: { p: 0, display: 'flex', flexDirection: 'column', gap: '2px' } }}
      >
        {menu?.type === 'FOLDER' && [
          <MenuItem key="open" sx={menuItemSx} onClick={() => handleOpenFolder(menu.target)}>
            <FolderOpenIcon /> Mở thư mục
          </MenuItem>,
          <MenuItem key="share" sx={menuItemSx} onClick={() => handleShareFolder(menu.target._id)}>
            <LinkIcon /> Lấy link chia sẻ
          </MenuItem>,
          <Divider key="divider-folder" sx={{ borderStyle: 'dashed', my: '2px !important' }} />,
          <MenuItem key="delete-folder" sx={menuItemDangerSx} onClick={() => handleAskDelete('FOLDER', menu.target)}>
            <TrashIcon /> Xóa thư mục
          </MenuItem>
        ]}
        {menu?.type === 'FILE' && [
          <MenuItem key="view" sx={menuItemSx} onClick={() => { setSelectedPreview(menu.target); handleCloseMenu(); }}>
            <EyeIcon /> Xem thử
          </MenuItem>,
          <MenuItem key="download" sx={menuItemSx} component="a" href={getDownloadUrl(menu.target.url)} download target="_blank" rel="noreferrer" onClick={handleCloseMenu}>
            <DownloadIcon /> Tải xuống
          </MenuItem>,
          isAdmin && <Divider key="divider-file" sx={{ borderStyle: 'dashed', my: '2px !important' }} />,
          isAdmin && (
            <MenuItem key="delete-file" sx={menuItemDangerSx} onClick={() => handleAskDelete('FILE', menu.target)}>
              <TrashIcon /> Xóa tệp tin
            </MenuItem>
          )
        ]}
      </Menu>

      {/* MODAL XEM THỬ FILE */}
      <Modal disableScrollLock open={Boolean(selectedPreview)} onClose={() => setSelectedPreview(null)}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(2px) !important',
            WebkitBackdropFilter: 'blur(2px) !important',
            bgcolor: 'rgba(123, 136, 149, 0.3)'
          }
        }}>
        <Box sx={{ ...dialogBoxSx, maxWidth: '800px', width: '92vw', maxHeight: '90vh', overflowY: 'auto' }}>
          {/* Tiêu đề tệp (Đã bỏ dấu X góc trên) */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <Typography
              title={selectedPreview?.name}
              sx={{
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 700,
                color: C.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%'
              }}
            >
              {selectedPreview?.name}
            </Typography>
          </Box>

          {/* Nội dung xem trước */}
          <Box sx={{ textAlign: 'center' }}>
            {selectedPreview?.fileType?.includes('image') && (
              <Box component="img" src={selectedPreview.url} alt={selectedPreview.name} sx={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '12px', objectFit: 'contain' }} />
            )}
            {selectedPreview?.fileType?.includes('pdf') && (
              <Box component="iframe" src={selectedPreview.url} title={selectedPreview.name} sx={{ width: '100%', height: '500px', border: 'none', borderRadius: '8px' }} />
            )}
            {selectedPreview?.fileType?.includes('video') && (
              <Box component="video" controls src={selectedPreview.url} sx={{ width: '100%', maxHeight: '60vh', borderRadius: '8px' }} />
            )}
            {selectedPreview?.fileType?.includes('audio') && (
              <Box component="audio" controls src={selectedPreview.url} sx={{ width: '100%', py: 3 }} />
            )}
            {selectedPreview && !/image|pdf|video|audio/.test(selectedPreview.fileType || '') && (
              <Box sx={{ py: 4, px: 2 }}>
                <Typography sx={{ fontFamily: FONT, fontSize: 14, color: C.textSub, mb: 1 }}>
                  Không hỗ trợ xem trực tiếp định dạng tệp này.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Hàng nút thao tác ở dưới: Đóng và Tải xuống */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3, pt: 2, borderTop: `1px dashed ${C.line}` }}>
            <Button onClick={() => setSelectedPreview(null)} sx={outlineBtnSx}>
              Đóng
            </Button>
            <Button
              component="a"
              href={getDownloadUrl(selectedPreview?.url)}
              download
              target="_blank"
              rel="noreferrer"
              sx={darkBtnSx}
            >
              Tải xuống
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal disableScrollLock disableRestoreFocus open={isCreateFolderOpen} onClose={handleCloseCreateFolder}>
        <Box sx={{ ...dialogBoxSx, width: 'min(420px, 92vw)' }}>
          <Typography sx={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, mb: 3 }}>
            Tạo thư mục mới
          </Typography>

          <form onSubmit={handleCreateFolderSubmit}>
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.25, p: 1.25,
                borderRadius: '12px', border: `1px dashed ${C.line}`, bgcolor: '#fff',
                '&:focus-within': { border: `1px solid ${C.text}` }
              }}
            >
              <TypeBadge type="folder" />
              <TextField
                fullWidth
                autoFocus
                variant="standard"
                placeholder="Nhập tên thư mục..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { fontFamily: FONT, fontSize: 14, fontWeight: 500 } }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
              <Button onClick={handleCloseCreateFolder} sx={outlineBtnSx}>Hủy</Button>
              <Button
                type="submit"
                disabled={!newFolderName.trim()}
                sx={{ ...darkBtnSx, '&.Mui-disabled': { bgcolor: C.fieldBg, color: C.textSub } }}
              >
                Tạo
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Modal
        disableScrollLock
        disableRestoreFocus
        open={Boolean(deleteTarget)}
        onClose={() => !isDeleting && setDeleteTarget(null)}
      >
        <Box sx={{ ...dialogBoxSx, width: 'min(420px, 92vw)' }}>
          <Typography sx={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, mb: 1.5 }}>
            {deleteTarget?.kind === 'FOLDER' ? 'Xóa thư mục' : 'Xóa tệp tin'}
          </Typography>

          <Typography sx={{ fontFamily: FONT, fontSize: 14, color: C.textSub, lineHeight: 1.7, mb: 3 }}>
            Bạn có chắc muốn xóa <b style={{ color: C.text }}>{deleteTarget?.item?.name}</b>
            {deleteTarget?.kind === 'FOLDER' && deleteTarget.item.fileCount > 0
              ? ` cùng ${deleteTarget.item.fileCount} tệp bên trong (${deleteTarget.item.storeSize})`
              : ''}
            ?{deleteTarget?.kind === 'FOLDER' ? ' Thư mục con cũng bị xóa theo.' : ''} Hành động này không thể khôi phục.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setDeleteTarget(null)} disabled={isDeleting} sx={outlineBtnSx}>
              Hủy
            </Button>
            <Button onClick={handleConfirmDelete} disabled={isDeleting} sx={dangerBtnSx}>
              Xóa
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal disableScrollLock disableRestoreFocus open={Boolean(shareLinkModal)} onClose={() => setShareLinkModal(null)}>
        <Box sx={{ ...dialogBoxSx, width: 'min(480px, 92vw)' }}>
          <Typography sx={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, mb: 0.5 }}>
            Chia sẻ thư mục
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: 14, color: C.textSub, mb: 3 }}>
            Bất kỳ ai có liên kết này đều xem được nội dung thư mục.
          </Typography>

          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1, p: 1.25, pl: 1.5,
              borderRadius: '12px', border: `1px dashed ${C.line}`, bgcolor: '#fff',
              '&:hover': { bgcolor: C.fieldBg },
              '&:focus-within': { border: `1px solid ${C.text}`, bgcolor: C.fieldBg }
            }}
          >
            <Box component="span" sx={{ display: 'inline-flex', color: C.textSub }}>
              <LinkIcon />
            </Box>
            <TextField
              fullWidth
              variant="standard"
              value={shareLinkModal || ''}
              onFocus={(e) => e.target.select()}
              InputProps={{ readOnly: true, disableUnderline: true, sx: { fontFamily: FONT, fontSize: 14, fontWeight: 500 } }}
            />
            <IconButton
              size="small"
              title="Sao chép"
              onClick={handleCopyShareLink}
              sx={{ color: C.textSub, '&:hover': { bgcolor: 'rgba(145, 158, 171, 0.16)' } }}
            >
              <CopyIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
            <Button onClick={() => setShareLinkModal(null)} sx={outlineBtnSx}>Đóng</Button>
            <Button onClick={handleCopyShareLink} sx={darkBtnSx}>Sao chép liên kết</Button>
          </Box>
        </Box>
      </Modal>

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </Box>
  );
};

export default DrivePage;