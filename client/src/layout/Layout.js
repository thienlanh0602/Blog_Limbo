import { Box } from '@mui/material'
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from 'react';

function Layout() {

    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            if (currentY > lastScrollY) {

                setShowHeader(false);
            } else if (currentY === 0) {
                setShowHeader(true);
            } 
            // else {
            //     setShowHeader(true);
            // }

            setLastScrollY(currentY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <>
            {showHeader && <Header />}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    px: 2,
                    mt: 26
                }}
            >
                <Outlet />
            </Box>
            {/* <Container>
                <Outlet />
            </Container> */}

        </>
    );
}
export default Layout;