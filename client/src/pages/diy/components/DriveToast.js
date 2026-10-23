import React from 'react';
import { Box } from '@mui/material';

export const ToastIcon = ({ type, C }) => (
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

export const DriveToast = ({ open, type, message, onClose, C }) => (
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
      fontSize: 14, fontWeight: 500, lineHeight: 1.5, whiteSpace: 'pre-line',
      cursor: 'pointer',
      opacity: open ? 1 : 0,
      visibility: open ? 'visible' : 'hidden',
      pointerEvents: open ? 'auto' : 'none',
      transform: open ? 'translate(-50%, 0)' : 'translate(-50%, 24px)',
      transition: 'opacity 0.25s ease, transform 0.25s ease, visibility 0.25s'
    }}
  >
    <ToastIcon type={type} C={C} />
    <span>{message}</span>
  </Box>
);