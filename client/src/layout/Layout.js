import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
    const { pathname } = useLocation();

    // Chỉ hiện footer ở trang chủ ("/" hoặc "")
    const isHome = pathname === '/' || pathname === '';

    return (
        <>
            <Header />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '100vw',
                    overflowX: 'hidden',
                    boxSizing: 'border-box',
                }}
            >
                <Outlet />
            </Box>
            {isHome && <Footer />}
        </>
    );
}

export default Layout;