import { Box } from '@mui/material';
import Sidebar from './sideBar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {

  const drawerWidth = 280;
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`,
        }}
      >

        <Outlet />

      </Box>
    </Box>
  );
};

export default AdminLayout;