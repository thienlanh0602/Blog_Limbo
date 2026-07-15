import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './sideBar';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { DRAWER_WIDTH } from '../../theme/breakpoints';
import { STATIC_IMAGES } from '../../utils/Staticimages';
import { optimizeCloudinaryUrl } from '../../utils/Cloudinaryhelper';


const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, md: 3 },
          pt: { xs: 9, md: 3 },
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              position: 'fixed',
              top: 16,
              left: 16,
              zIndex: 1300,
              border: '2px solid black',
              borderRadius: 0,
              backgroundColor: '#4efcd3',
              boxShadow: '2px 2px 0px black',
              width: 44,
              height: 44,
            }}
          >
            <Box component="img" src={optimizeCloudinaryUrl(STATIC_IMAGES.menu, 20)} alt="Menu" sx={{ width: 20, height: 20 }} />
          </IconButton>
        )}

        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
