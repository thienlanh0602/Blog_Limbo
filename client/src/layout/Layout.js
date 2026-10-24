import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const HIDE_FOOTER_ROUTES = ['/music', '/image', '/fm'];

function Layout() {
    const { pathname } = useLocation();
    const path = pathname.toLowerCase();

    // Khớp cả "/fm", "/fm/" và "/fm/bat-ky-gi"
    const shouldHideFooter = HIDE_FOOTER_ROUTES.some(
        (route) => path === route || path.startsWith(`${route}/`)
    );

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
            {!shouldHideFooter && <Footer />}
        </>
    );
}

export default Layout;