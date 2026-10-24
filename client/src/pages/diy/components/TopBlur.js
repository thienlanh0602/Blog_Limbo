import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const TOP_BLUR_HEIGHT = 200;
const SCROLL_THRESHOLD = 8;
const IDLE_BLUR = 0.1; // khác 0 để trình duyệt dựng sẵn layer

const TOP_BLUR_LAYERS = [
  { blur: 12, mask: 'linear-gradient(to bottom, #000 0%, #000 20%, transparent 45%)' },
  { blur: 6, mask: 'linear-gradient(to bottom, #000 10%, #000 35%, transparent 65%)' },
  { blur: 3, mask: 'linear-gradient(to bottom, #000 25%, #000 50%, transparent 80%)' }
];

export const TopBlur = () => {
  const layerRefs = useRef([]);

  useEffect(() => {
    let active = null;
    const scrolledTargets = new Set();

    const apply = (next) => {
      if (active === next) return;
      active = next;
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const value = `blur(${next ? TOP_BLUR_LAYERS[i].blur : IDLE_BLUR}px)`;
        el.style.backdropFilter = value;
        el.style.webkitBackdropFilter = value;
      });
    };

    const onScroll = (e) => {
      const t = e.target;
      const isPage = t === document || t === document.documentElement || t === document.body;

      if (isPage) {
        const top = window.scrollY || document.documentElement.scrollTop || 0;
        top > SCROLL_THRESHOLD ? scrolledTargets.add(window) : scrolledTargets.delete(window);
      } else if (t.scrollHeight > t.clientHeight) {
        // chỉ tính các vùng cuộn dọc (bỏ qua carousel cuộn ngang)
        t.scrollTop > SCROLL_THRESHOLD ? scrolledTargets.add(t) : scrolledTargets.delete(t);
      }
      apply(scrolledTargets.size > 0);
    };

    // capture: bắt được cả scroll của container bên trong, không chỉ window
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });

    apply((window.scrollY || 0) > SCROLL_THRESHOLD);

    return () => document.removeEventListener('scroll', onScroll, { capture: true });
  }, []);

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: TOP_BLUR_HEIGHT,
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    >
      {TOP_BLUR_LAYERS.map(({ mask }, i) => (
        <Box
          key={i}
          ref={(el) => { layerRefs.current[i] = el; }}
          sx={{
            position: 'absolute', inset: 0,
            backdropFilter: `blur(${IDLE_BLUR}px)`,
            WebkitBackdropFilter: `blur(${IDLE_BLUR}px)`,
            maskImage: mask,
            WebkitMaskImage: mask,
            transition: 'backdrop-filter 0.2s ease, -webkit-backdrop-filter 0.2s ease',
            willChange: 'backdrop-filter',
            transform: 'translateZ(0)'
          }}
        />
      ))}
    </Box>
  );
};