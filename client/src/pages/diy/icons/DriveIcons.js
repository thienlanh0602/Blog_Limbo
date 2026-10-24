import React from 'react';
import { Box } from '@mui/material';

const FONT = '"Public Sans", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif';

export const Svg = ({ children, size = 20, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
);

export const SearchIcon = () => (
  <Svg size={18} strokeWidth={2.5}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Svg>
);

export const DotSeparatorIcon = () => (
  <svg width="3" height="3" viewBox="0 0 3 3" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', flexShrink: 0 }}>
    <circle cx="1.5" cy="1.5" r="1.5" fill="#C4CDD5" />
  </svg>
);

export const UploadIcon = () => (
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
    <path mask="url(#uploadCloudMask)" d="M7 20a5 5 0 0 1-.9-9.92A6.5 6.5 0 0 1 18.6 9.4 5.3 5.3 0 0 1 17.5 20H7z" />
  </svg>
);

export const FolderPlusIcon = () => (
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
    <path mask="url(#folderPlusMask)" d="M3 7a2 2 0 0 1 2-2h4.2a2 2 0 0 1 1.5.7L12.3 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
  </svg>
);

export const DotsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" />
  </svg>
);

export const FolderIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="4 8 40 34" style={{ display: 'block', flexShrink: 0 }}>
    <path d="M4 12a4 4 0 014-4h10.2a4 4 0 012.9 1.2L24 12h16a4 4 0 014 4v22a4 4 0 01-4 4H8a4 4 0 01-4-4V12z" fill="#FFD666" />
    <path d="M4 20a4 4 0 014-4h32a4 4 0 014 4v18a4 4 0 01-4 4H8a4 4 0 01-4-4V20z" fill="#FFAB00" />
  </svg>
);

export const FolderOpenIcon = () => (<Svg><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v1H3V7z" /><path d="M3 10h18l-1.6 7.2A2 2 0 0117.45 19H5.2a2 2 0 01-2-1.7L3 10z" /></Svg>);
export const LinkIcon = () => (<Svg><path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1-1" /></Svg>);
export const EyeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    {/* Con ngươi */}
    <path d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0" />
    {/* Thân mắt (khoét lỗ tròn bằng evenodd) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5"
    />
  </svg>
); export const DownloadIcon = () => (<Svg><path d="M12 4v12" /><path d="M7 11l5 5 5-5" /><path d="M4 20h16" /></Svg>);
export const TrashIcon = () => (<Svg><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></Svg>);
export const CopyIcon = () => (<Svg><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 012-2h9" /></Svg>);

export const StarIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24"
    fill={filled ? '#FFAB00' : 'none'} stroke={filled ? '#FFAB00' : 'currentColor'}
    strokeWidth="2" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
  </svg>
);

export const EditIcon = ({ size = 20, strokeWidth = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

export const CrownIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" style={{ display: 'block' }}>
    <defs>
      <linearGradient id="crownGold" x1="12" y1="4" x2="12" y2="19" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFD666" />
        <stop offset="1" stopColor="#FFAB00" />
      </linearGradient>
    </defs>
    <path d="M4.2 8.6l3.5 3.3L12 5.6l4.3 6.3 3.5-3.3-1.5 8.4H5.7L4.2 8.6z" fill="url(#crownGold)" stroke="url(#crownGold)" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="3.6" cy="7.4" r="1.5" fill="#FFAB00" />
    <circle cx="12" cy="4.6" r="1.5" fill="#FFAB00" />
    <circle cx="20.4" cy="7.4" r="1.5" fill="#FFAB00" />
    <rect x="5.2" y="18.6" width="13.6" height="2.4" rx="1.2" fill="#B76E00" />
    <circle cx="12" cy="13.6" r="1.3" fill="#FFF5CC" />
  </svg>
);

export const GuestIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M7.4 4.6A2 2 0 019.3 3.2h5.4a2 2 0 011.9 1.4L18 9.4H6l1.4-4.8z" fill="#637381" />
    <rect x="2.5" y="9.4" width="19" height="2.2" rx="1.1" fill="#637381" />
    <circle cx="7.6" cy="16.4" r="3.1" fill="none" stroke="#637381" strokeWidth="2" />
    <circle cx="16.4" cy="16.4" r="3.1" fill="none" stroke="#637381" strokeWidth="2" />
    <path d="M10.6 15.8c.9-.7 1.9-.7 2.8 0" fill="none" stroke="#637381" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ChevronDownIcon = () => (<Svg size={16} strokeWidth={2.5}><path d="M6 9l6 6 6-6" /></Svg>);
export const ChevronLeftIcon = () => (<Svg size={20} strokeWidth={2.5}><path d="M15 6l-6 6 6 6" /></Svg>);
export const ChevronRightIcon = ({ size = 20, strokeWidth = 2.5 }) => (
  <Svg size={size} strokeWidth={strokeWidth}><path d="M9 6l6 6-6 6" /></Svg>
);

export const FILE_STYLES = {
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

export const FileIcon = ({ type = 'other', size = 48 }) => {
  const s = FILE_STYLES[type] || FILE_STYLES.other;
  return s.svg(size);
};

export const TypeBadge = ({ type }) =>
  type === 'folder' ? <FolderIcon size={32} /> : <FileIcon type={type} size={32} />;