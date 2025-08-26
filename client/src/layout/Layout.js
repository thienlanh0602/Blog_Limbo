import { Box, Container } from '@mui/material'
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from 'react';
import Footer from './Footer';

function Layout() {

    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    // Lưu scroll trước khi rời trang
    useEffect(() => {
        const saveScrollPos = () => {
            sessionStorage.setItem("scrollY", window.scrollY);
        };
        window.addEventListener("beforeunload", saveScrollPos);
        return () => window.removeEventListener("beforeunload", saveScrollPos);
    }, []);

    // Khôi phục scroll sau khi reload
    useEffect(() => {
        const savedPosition = sessionStorage.getItem("scrollY");
        if (savedPosition) {
            const target = parseInt(savedPosition, 10);

            const restoreScroll = () => {
                // Khi DOM đã render đủ chiều cao thì mới scroll
                if (document.body.scrollHeight > target) {
                    window.scrollTo(0, target);
                } else {
                    setTimeout(restoreScroll, 100); // đợi thêm 100ms rồi thử lại
                }
            };

            restoreScroll();
        }
    }, []);


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
            {/* { <Header />} */}
            <Box
                sx={{
                    position: "fixed", // để header bám trên cùng
                    top: 30,
                    left: 0,
                    right: 0,
                    height: "64px",
                    backgroundColor: "white",
                    transition: "all 0.3s ease",  // hiệu ứng mượt
                    transform: showHeader ? "translateY(0)" : "translateY(-150%)",
                    zIndex: 1200, // để header nổi trên content
                }}
            >
                <Header />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    textAlign: "center",
                    my: 40
                }}
            >
                <Outlet />
            </Box>
            <Footer />

        </>
    );
}
export default Layout;