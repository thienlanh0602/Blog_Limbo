import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { STATIC_IMAGES } from '../utils/Staticimages';
import { optimizeCloudinaryUrl } from '../utils/Cloudinaryhelper';
import { useState, useEffect } from 'react';

import {
    BoxLogo, BoxNav, ButtonNav, MobileNavBar, MobileNavItem,
    StyleAppBar, StyleContainer, StyleToolbar, TypographyLogo,
} from "../components/header/header";

const navBar = [
    { label: 'RESUME', path: '/resume' },
    { label: 'MUSIC', path: '/music' },
    { label: 'KABAN', path: '/kaban' },
    { label: 'IMAGE', path: '/image' },
    { label: 'FM', path: '/fm' },
]

const COMPACT_HEADER_ROUTES = ['/music', '/image', '/fm'];

// Màu nền header khi thu nhỏ, theo từng trang
const COMPACT_HEADER_BG = {
    '/music': '#4EFCD3',
    '/fm': '#FFD100',
};

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Giờ hiện tại dạng "03:45 PM /26", cập nhật đầu mỗi phút
const HeaderClock = () => {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        let timer;
        const scheduleNext = () => {
            timer = setTimeout(() => {
                setNow(new Date());
                scheduleNext();
            }, 60000 - (Date.now() % 60000) + 50);
        };
        scheduleNext();
        return () => clearTimeout(timer);
    }, []);

    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    const year = String(now.getFullYear()).slice(-2);

    return (
        <Box
            component="span"
            aria-label={`${time}, năm ${now.getFullYear()}`}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                fontWeight: 600,
                letterSpacing: '0.04em',
                fontVariantNumeric: 'tabular-nums',
                color: 'inherit'
            }}
        >
            {time} /{year}
        </Box>
    );
};

// Icon 3 gạch <-> dấu X, có transition
const MenuLinesIcon = ({ open }) => {
    const base = {
        transformOrigin: '12px 12px',
        transition: `transform 0.35s ${EASE}, opacity 0.2s ease`,
    };
    return (
        <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ display: 'block' }}
        >
            <line x1="4" y1="6" x2="20" y2="6"
                style={{ ...base, transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }} />
            <line x1="4" y1="12" x2="20" y2="12"
                style={{ ...base, opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'none' }} />
            <line x1="4" y1="18" x2="20" y2="18"
                style={{ ...base, transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
        </svg>
    );
};

function Header() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isCompactPage = COMPACT_HEADER_ROUTES.includes(location.pathname);
    const compact = scrolled || isCompactPage;
    const compactBg = compact ? COMPACT_HEADER_BG[location.pathname] : undefined;

    // Chỉ coi là "mở" khi đang ở mobile và header chưa thu nhỏ
    const menuOpen = open && isMobile && !compact;

    useEffect(() => {
        const handleScroll = () => {
            if (open) setOpen(false);
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [open]);

    // Đổi trang thì đóng menu
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

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

    return (
        <StyleAppBar
            showHeader={true}
            scrolled={compact}
            sx={compactBg ? {
                background: compactBg,
                backdropFilter: 'none',
                border: 'none',
                borderBottom: 'none',
                boxShadow: 'none',
                outline: 'none',
                transition: 'background 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            } : undefined}
        >
            <StyleToolbar sx={{
                transition: `all 0.35s ${EASE}`,
                minHeight: compact ? { xs: 44, md: 52 } : undefined,
                ...(compact && { px: 0 }),
                // Menu mở: bỏ padding phải để nút X sát mép
                ...(menuOpen && { pr: { xs: 1, sm: 2 } }),
            }}>
                <StyleContainer
                    sx={{
                        transition: `padding 0.35s ${EASE}`,
                        ...(compact && { px: 0, justifyContent: 'center' }),
                        ...(menuOpen && { pr: 0 }),
                    }}
                >
                    {/* Logo: trên mobile sẽ mờ + trượt ra khi mở menu */}
                    <BoxLogo
                        onClick={handleLogoClick}
                        sx={isMobile ? {
                            transition: `opacity 0.3s ease, transform 0.35s ${EASE}`,
                            opacity: menuOpen ? 0 : 1,
                            transform: menuOpen ? 'translateX(-16px)' : 'translateX(0)',
                            pointerEvents: menuOpen ? 'none' : 'auto',
                        } : undefined}
                    >
                        <Box
                            component="img"
                            src={optimizeCloudinaryUrl(STATIC_IMAGES.logo_intro, 1000)}
                            alt="Logo"
                            sx={{
                                height: compact
                                    ? { xs: 22, sm: 24, md: 24 }
                                    : { xs: 26, sm: 28, md: 30 },
                                transform: 'scaleX(-1)',
                                transition: `height 0.35s ${EASE}`,
                            }}
                        />
                        <TypographyLogo sx={{ transition: `font-size 0.35s ${EASE}` }}>
                            Limbo
                        </TypographyLogo>
                    </BoxLogo>

                    {!compact && (
                        isMobile ? (
                            <>
                                {/* Thanh nav ngang, trượt vào đúng chỗ logo */}
                                <MobileNavBar open={menuOpen}>
                                    {navBar.map((item, i) => (
                                        <MobileNavItem
                                            key={item.path}
                                            component={Link}
                                            to={item.path}
                                            open={menuOpen}
                                            index={i}
                                            active={location.pathname === item.path}
                                            tabIndex={menuOpen ? 0 : -1}
                                            onClick={() => setOpen(false)}
                                        >
                                            {item.label}
                                        </MobileNavItem>
                                    ))}
                                </MobileNavBar>

                                <IconButton
                                    aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
                                    aria-expanded={menuOpen}
                                    disableRipple
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) => {
                                        e.currentTarget.blur();
                                        setOpen((prev) => !prev);
                                    }}
                                    sx={{
                                        p: 0.5,
                                        ml: 'auto',        // luôn đẩy sát phải
                                        flexShrink: 0,
                                        color: 'black',
                                        backgroundColor: 'transparent',
                                        WebkitTapHighlightColor: 'transparent',
                                        '&:hover': { backgroundColor: 'transparent' },
                                        '&:active': { backgroundColor: 'transparent', opacity: 0.6 },
                                    }}
                                >
                                    <MenuLinesIcon open={menuOpen} />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <BoxNav>
                                    {navBar.map((item) => (
                                        <ButtonNav key={item.path} LinkComponent={Link} to={item.path}>
                                            {item.label}
                                        </ButtonNav>
                                    ))}
                                </BoxNav>
                                <Box>
                                    <HeaderClock />
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