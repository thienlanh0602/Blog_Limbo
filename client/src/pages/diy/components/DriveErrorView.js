import React from 'react';
import { Box, Typography } from '@mui/material';
import { optimizeCloudinaryUrl } from '../../../utils/Cloudinaryhelper';
import { STATIC_IMAGES } from '../../../utils/Staticimages';

export const DriveErrorView = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: 'calc(100vh - 70px)',
        px: 2,
        fontFamily: 'inherit'
      }}
    >
      {/* Số 403 với icon nằm lồng vào số 0 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: { xs: 100, sm: 140, md: 200 },
          fontWeight: 900,
          lineHeight: 1,
          color: '#FFD100', // Màu vàng nổi bật
          userSelect: 'none',
          my: 1
        }}
      >
        <span>4</span>

        {/* Số 0 chứa Icon Avatar ở giữa */}
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: { xs: -0.5, md: -1 }
          }}
        >
          <span>0</span>
          <Box
            component="img"
            src={optimizeCloudinaryUrl(STATIC_IMAGES.authentication, 400)}
            alt="403 error avatar"
            sx={{
              position: 'absolute',
              width: '50%',
              height: '50%',
              objectFit: 'contain',
              borderRadius: '20%'
            }}
          />
        </Box>

        <span>3</span>
      </Box>

      {/* Thông báo chi tiết phía dưới */}
      <Typography
        sx={{
          fontSize: { xs: 10, md: 15 },
          fontWeight: 300,
          color: '#637381',
          maxWidth: 460,
          lineHeight: 1.6,
          mt: 1
        }}
      >
        Bạn cần quyền Admin hoặc link chia sẻ hợp lệ để truy cập trang này.
      </Typography>
    </Box>
  );
};