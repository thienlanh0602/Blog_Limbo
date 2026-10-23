import React from 'react';
import { Box } from '@mui/material';

const TOP_BLUR_HEIGHT = 200;
const TOP_BLUR_LAYERS = [
  { blur: 12, mask: 'linear-gradient(to bottom, #000 0%, #000 20%, transparent 45%)' },
  { blur: 6, mask: 'linear-gradient(to bottom, #000 10%, #000 35%, transparent 65%)' },
  { blur: 3, mask: 'linear-gradient(to bottom, #000 25%, #000 50%, transparent 80%)' },
  { blur: 1, mask: 'linear-gradient(to bottom, #000 40%, transparent 100%)' }
];

export const TopBlur = ({ visible }) => (
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