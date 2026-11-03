import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { STATIC_IMAGES } from '../utils/Staticimages';
import { optimizeCloudinaryUrl } from '../utils/Cloudinaryhelper';
import { useState, useEffect } from 'react';

import { BoxImage, BoxLogo, BoxNav, ButtonImage, ButtonNav, EditDrawer, StyleAppBar, StyleContainer, StyleToolbar, TypographyLogo } from "../components/header/header";

const navBar = [
    { label: 'RESUME', path: '/resume' },
    { label: 'MUSIC', path: '/music' },
    { label: 'KABAN', path: '/color' },
    { label: 'IMAGE', path: '/image' },
    { label: 'FM', path: '/fm' },
]

const COMPACT_HEADER_ROUTES = ['/music', '/image', '/fm' ];

// Màu nền header khi thu nhỏ, theo từng trang (trang không khai báo thì giữ nền mặc định)
const COMPACT_HEADER_BG = {
    '/music': '#4EFCD3',
    '/fm': '#FFD100',
};

// Giờ hiện tại dạng "03:45 PM /26" (26 là 2 số cuối của năm), cập nhật mỗi phút
const HeaderClock = () => {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        let timer;
        // Hẹn đúng đầu mỗi phút để đồng hồ luôn chạy khớp, không phải cập nhật mỗi giây
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
    }); // vd: "03:45 PM"
    const year = String(now.getFullYear()).slice(-2); // 2026 -> "26"

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
                fontVariantNumeric: 'tabular-nums', // chữ số cùng độ rộng, đồng hồ không bị nhảy
                color: 'inherit'
            }}
        >
            {time} /{year}
        </Box>
    );
};

// Icon 3 gạch (menu) vẽ bằng SVG, lấy màu theo chữ của nút
const MenuLinesIcon = () => (
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
        <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

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
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: compact ? { xs: 44, md: 52 } : undefined,
                // Thu nhỏ: bỏ lề ngang để logo không bị tràn ra ngoài hộp hẹp
                ...(compact && { px: 0 }),
            }}>
                <StyleContainer
                    sx={{
                        transition: 'padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        // Thu nhỏ: bỏ lề ngang và căn logo vào giữa hộp
                        ...(compact && { px: 0, justifyContent: 'center' }),
                    }}
                >

                    <BoxLogo
                        onClick={handleLogoClick}
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
                                transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        />
                        <TypographyLogo sx={{
                            // fontSize: compact ? { xs: '0.8rem', md: '0.9rem' } : undefined,
                            transition: 'font-size 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}>
                            Limbo
                        </TypographyLogo>
                    </BoxLogo>

                    {!compact && (
                        isMobile ? (
                            <>
                                {/* Điện thoại: chỉ icon 3 gạch, không nền, không viền, không bóng */}
                                <IconButton
                                    aria-label="Mở menu"
                                    disableRipple
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) => {
                                        e.currentTarget.blur();
                                        setOpen(true);
                                    }}
                                    sx={{
                                        p: 0.5,
                                        color: 'black',
                                        backgroundColor: 'transparent',
                                        WebkitTapHighlightColor: 'transparent',
                                        '&:hover': { backgroundColor: 'transparent' },
                                        '&:active': { backgroundColor: 'transparent', opacity: 0.6 }
                                    }}
                                >
                                    <MenuLinesIcon />
                                </IconButton>

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