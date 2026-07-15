import { Box } from '@mui/material'
import { Outlet, useLocation } from "react-router-dom"; 
import Header from "./Header";
import { useEffect, useState } from 'react';
import Footer from './Footer';

function Layout() {
    const location = useLocation();
    
    const hideFooterRoutes = ['/music', '/image'];

    const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

    return (
        <>
            <Header />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    textAlign: "center",
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