import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { SearchIcon, ChevronDownIcon } from '../icons/DriveIcons';

export const FilterButton = ({ label, onClick, active, C }) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.75,
      height: 40, px: 1.5, border: 'none', borderRadius: '8px',
      bgcolor: active ? C.fieldBg : 'transparent',
      fontFamily: 'kanit, sans-serif',
      color: C.text, fontSize: 14, fontWeight: 500,
      cursor: 'pointer', whiteSpace: 'nowrap',
      '&:hover': { bgcolor: C.fieldBg }
    }}
  >
    {label}
    <ChevronDownIcon />
  </Box>
);

export const DriveFilters = ({
  dateLabel,
  dateRange,
  handleOpenDate,
  typeLabel,
  typeFilter,
  handleOpenType,
  search,
  setSearch,
  C
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
      <FilterButton label={dateLabel} active={Boolean(dateRange.start)} onClick={handleOpenDate} C={C} />
      <FilterButton label={typeLabel} active={typeFilter.length > 0} onClick={handleOpenType} C={C} />
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
            fontSize: 14,
            '& fieldset': { borderColor: C.line },
            '&:hover fieldset': { borderColor: C.text },
            '&.Mui-focused fieldset': { borderColor: C.text, borderWidth: 1.5 }
          }
        }}
      />
    </Box>
  );
};