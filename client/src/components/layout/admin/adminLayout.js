import { Box } from '@mui/material';
import Sidebar from './sideBar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {

  const drawerWidth = 240;
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${drawerWidth}px`, // Đẩy nội dung sang phải đúng chiều rộng sidebar
          p: 5,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;