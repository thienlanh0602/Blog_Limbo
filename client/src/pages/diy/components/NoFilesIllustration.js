import React from 'react';
import { Box } from '@mui/material';

export const NoFilesIllustration = ({ size = 320 }) => {
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
      <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ position: 'absolute', inset: 0 }}>
        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(145, 158, 171, 0.12)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(145, 158, 171, 0.16)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="65" fill="none" stroke="rgba(145, 158, 171, 0.20)" strokeWidth="1.5" />
      </svg>

      <Box
        sx={{
          position: 'relative', zIndex: 2, width: 72, height: 88, bgcolor: '#D5D8DC',
          borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.2)'
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, right: 0, width: 24, height: 24, bgcolor: 'rgba(255, 255, 255, 0.5)', borderBottomLeftRadius: 12 }} />
        <Box sx={{ width: '40px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Box sx={{ height: '3px', bgcolor: '#868E96', borderRadius: '2px', width: '100%' }} />
          <Box sx={{ height: '3px', bgcolor: '#868E96', borderRadius: '2px', width: '75%' }} />
          <Box sx={{ height: '3px', bgcolor: '#868E96', borderRadius: '2px', width: '90%' }} />
        </Box>
      </Box>

      {/* Các icon nhỏ trang trí xung quanh */}
      <Box sx={{ position: 'absolute', top: '66%', left: '24%', zIndex: 2, p: 1, bgcolor: '#E2E6EA', borderRadius: '12px', boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </Box>
      <Box sx={{ position: 'absolute', top: '20%', left: '25%', zIndex: 2, p: 1, bgcolor: '#E2E6EA', borderRadius: '10px', boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </Box>
      <Box sx={{ position: 'absolute', top: '1%', right: '24%', zIndex: 2, p: 1.2, bgcolor: '#E2E6EA', borderRadius: '12px', boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      </Box>
      <Box sx={{ position: 'absolute', top: '35%', right: '0%', zIndex: 2, p: 1, bgcolor: '#E2E6EA', borderRadius: '10px', boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
      </Box>
      <Box sx={{ position: 'absolute', bottom: '26%', right: '20%', zIndex: 2, p: 1, bgcolor: '#E2E6EA', borderRadius: '10px', boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="#495057" />
        </svg>
      </Box>
      <Box sx={{ position: 'absolute', bottom: '38%', left: '1%', zIndex: 2, p: 1, bgcolor: '#E2E6EA', borderRadius: '10px', boxShadow: '0 4px 12px rgba(145, 158, 171, 0.15)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
      </Box>
    </Box>
  );
};