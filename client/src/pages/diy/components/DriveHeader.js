import React from 'react';
import { Box, Button, Typography, IconButton, Tooltip } from '@mui/material';
import { CrownIcon, GuestIcon, FolderPlusIcon, UploadIcon, EyeIcon } from '../icons/DriveIcons';

export const DriveHeader = ({
  isAdmin,
  shareToken,
  setIsCreateFolderOpen,
  isUploading,
  uploadState,
  headerBtnSx,
  C,
  setChoiceModalOpen // Nhận prop để mở modal lựa chọn upload
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, mt: 0.5 }}>
        <Typography component="h1" sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 600, lineHeight: 1.3 }}>
          File manager
        </Typography>
        {isAdmin ? (
          <Tooltip arrow={false}>
            <IconButton size="small" sx={{ color: C.textSub }}>
              <CrownIcon />
            </IconButton>
          </Tooltip>
        ) : shareToken ? (
          <Tooltip arrow>
            <Box component="span" sx={{ display: 'inline-flex', cursor: 'default', mt: 0.5 }}>
              <GuestIcon />
            </Box>
          </Tooltip>
        ) : null}
      </Box>

      {isAdmin ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Button
            onClick={() => setIsCreateFolderOpen(true)}
            startIcon={<FolderPlusIcon />}
            sx={headerBtnSx}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontWeight: 600 }}>
              Tạo thư mục
            </Box>
          </Button>

          {/* Nút Tải lên bấm vào sẽ mở Modal lựa chọn (Browser / Link) */}
          <Button
            onClick={() => setChoiceModalOpen(true)}
            disabled={isUploading}
            startIcon={<UploadIcon />}
            sx={headerBtnSx}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontWeight: 600 }}>
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
            fontWeight: 500, fontSize: 14,
            '&.Mui-disabled': { bgcolor: C.fieldBg, color: C.textSub }
          }}
        >
          Chỉ xem
        </Button>
      ) : null}
    </Box>
  );
};