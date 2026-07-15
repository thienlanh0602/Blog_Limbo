import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { STATIC_IMAGES } from '../utils/Staticimages';
import { optimizeCloudinaryUrl } from '../utils/Cloudinaryhelper';
import { useState, useEffect } from 'react';

import { BoxImage, BoxLogo, BoxNav, ButtonImage, ButtonNav, EditDrawer, StyleAppBar, StyleContainer, StyleToolbar, TypographyLogo } from "../components/header/header";

const navBar = [
    { label: 'Resume', path: '/resume' },
    { label: 'Music', path: '/music' },
    { label: 'Color', path: '/color' },
    { label: 'Image', path: '/image' },
    { label: 'DIY', path: '/diy' },
];

const COMPACT_HEADER_ROUTES = ['/music', '/image'];

function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isCompactPage = COMPACT_HEADER_ROUTES.includes(location.pathname);
    const compact = scrolled || isCompactPage;

    useEffect(() => {
        const handleScroll = () => {
            if (open) setOpen(false);
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [open]);

    useEffect(() => {
        const saveScrollPos = () => {
            sessionStorage.setItem("scrollY", window.scrollY);
        };
        window.addEventListener("beforeunload", saveScrollPos);
        return () => window.removeEventListener("beforeunload", saveScrollPos);
    }, []);

    useEffect(() => {
        const savedPosition = sessionStorage.getItem("scrollY");
        if (savedPosition) {
            const target = parseInt(savedPosition, 10);
            const restoreScroll = () => {
                if (document.body.scrollHeight > target) {
                    window.scrollTo(0, target);
                } else {
                    setTimeout(restoreScroll, 200);
                }
            };
            restoreScroll();
        }
    }, []);

    const handleLogoClick = () => {
        if (scrolled) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            if (isCompactPage) {
                sessionStorage.setItem('skipIntro', '1');
            }
            navigate('/');
        }
    };

    const handleDrawerNavClick = (e) => {
        if (e.currentTarget) {
            e.currentTarget.blur();
        }
        setOpen(false);
    };

    return (
        <StyleAppBar showHeader={true} scrolled={compact}>
            <StyleToolbar sx={{
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: compact ? { xs: 44, md: 52 } : undefined,
            }}>
                <StyleContainer>

                    <BoxLogo
                        onClick={handleLogoClick}
                    >
                        <Box
                            component="img"
                            src={optimizeCloudinaryUrl(STATIC_IMAGES.logo_intro, 1000)}
                            alt="Logo"
                            sx={{
                                height: compact
                                    ? { xs: 22, sm: 24, md: 26 }
                                    : { xs: 30, sm: 32, md: 36 },
                                transform: 'scaleX(-1)',
                                transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        />
                        <TypographyLogo sx={{
                            fontSize: compact ? { xs: '0.8rem', md: '0.9rem' } : undefined,
                            transition: 'font-size 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}>
                            Limbo
                        </TypographyLogo>
                    </BoxLogo>

                    {!compact && (
                        isMobile ? (
                            <>
                                <ButtonImage onClick={(e) => {
                                    e.currentTarget.blur();
                                    setOpen(true);
                                }}>
                                    <BoxImage component='img' src={optimizeCloudinaryUrl(STATIC_IMAGES.menu, 20)} />
                                </ButtonImage>

                                <EditDrawer open={open} onClose={() => setOpen(false)}>
                                    {navBar.map((item) => (
                                        <ButtonNav
                                            onClick={handleDrawerNavClick}
                                            key={item.path}
                                            LinkComponent={Link}
                                            to={item.path}
                                        >
                                            {item.label}
                                        </ButtonNav>
                                    ))}
                                    <ButtonImage onClick={(e) => e.currentTarget.blur()}>
                                        <BoxImage component='img' src={optimizeCloudinaryUrl(STATIC_IMAGES.arrow, 30)} />
                                    </ButtonImage>
                                </EditDrawer>
                            </>
                        ) : (
                            <>
                                <BoxNav>
                                    {navBar.map((item) => (
                                        <ButtonNav
                                            key={item.path}
                                            LinkComponent={Link}
                                            to={item.path}
                                        >
                                            {item.label}
                                        </ButtonNav>
                                    ))}
                                </BoxNav>
                                <Box>
                                    <ButtonImage>
                                        <BoxImage component='img' src={optimizeCloudinaryUrl(STATIC_IMAGES.arrow, 30)} />
                                    </ButtonImage>
                                </Box>
                            </>
                        )
                    )}
                </StyleContainer>
            </StyleToolbar>
        </StyleAppBar>
    );
}

export default Header;