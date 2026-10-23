import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/DriveIcons';
import { startOfDay, isSameDay } from '../utils/driveHelpers';

const WEEKDAYS = ['T', 'T', 'T', 'T', 'T', 'T', 'C'];
const RANGE_BG = 'rgba(145, 158, 171, 0.16)';

export const CalendarMonth = ({ month, start, end, onPick, onPrev, onNext, cTokens }) => {
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
    <Box sx={{ flex: '1 1 300px', minWidth: 0, p: 2.5, borderRadius: '16px', border: `1px dashed ${cTokens.line}` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
          tháng {m + 1} {y}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={onPrev} sx={{ color: cTokens.text }}><ChevronLeftIcon /></IconButton>
          <IconButton size="small" onClick={onNext} sx={{ color: cTokens.text }}><ChevronRightIcon /></IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 0.5 }}>
        {WEEKDAYS.map((w, i) => (
          <Box key={i} sx={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: cTokens.textSub, py: 1 }}>{w}</Box>
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
                  border: !selected && isSameDay(d, today) ? `1px solid ${cTokens.text}` : 'none',
                  bgcolor: selected ? cTokens.text : 'transparent',
                  color: selected ? '#fff' : cTokens.text,
                  fontSize: 14, fontWeight: selected ? 700 : 400,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: selected ? cTokens.text : cTokens.fieldBg }
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