import { AppBar, Box, Button, Container, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material"

export const StyleAppBar = ({ children, position = 'fixed', showHeader = true, scrolled = false, sx = {}, ...props }) => {
    return (
        <AppBar
            position={position}
            sx={{
                top: { xs: 22, md: 35 },
                left: "50%",
                transform: showHeader
                    ? "translateX(-50%) translateY(0)"
                    : "translateX(-50%) translateY(-200%)",
                width: { xs: "80%", sm: "85%", md: "80%" },
                maxWidth: scrolled ? { xs: 98, sm: 110, md: 142 } : 1000,
                borderRadius: { xs: "30px", md: "50px" },
                border: "1px solid black",
                boxShadow: "none",
                backgroundColor: "#ffffff",
                color: "black",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 1200,
                py: 0,
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                userSelect: 'none',
                ...sx,
            }}
            {...props}
        >
            {children}
        </AppBar>
    )
}

export const StyleToolbar = ({ children, sx = {}, ...props }) => {
    return (
        <Toolbar
            disableGutters
            sx={{
                minHeight: { xs: 42, sm: 48 },
                px: { xs: 4, sm: 2, md: 1 },
                ...sx
            }}
            {...props}
        >
            {children}
        </Toolbar>
    )
}

export const StyleContainer = ({ children, sx = {}, ...props }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    let maxWidth = 'lg';
    if (isTablet) maxWidth = 'md';
    if (isMobile) maxWidth = false;

    return (
        <Container
            maxWidth={maxWidth}
            disableGutters
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: { xs: 2, sm: 3, md: 5 },
                width: '100%',
                cursor: "pointer",
                ...sx,
            }}
            {...props}
        >
            {children}
        </Container>
    )
}

// FIX: trước đây sx bị bỏ qua, giờ được merge vào
export const BoxLogo = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1,
                color: 'black',
                ...sx,
            }}
            {...props}
        >
            {children}
        </Box>
    )
}

// FIX: merge sx, giữ lại style theo breakpoint
export const BoxNav = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                gap: 4,
                alignItems: 'center',
                [theme.breakpoints.between('sm', 'md')]: {
                    gap: 2
                },
                ...(typeof sx === 'function' ? sx(theme) : sx),
            })}
            {...props}
        >
            {children}
        </Box>
    )
}

export const ButtonNav = ({ children, color = 'inherit', sx = {}, ...props }) => {
    return (
        <Button
            color={color}
            sx={{
                display: 'flex',
                fontSize: { xs: 12, sm: 15 },
                fontWeight: 600,
                flexDirection: 'column',
                textTransform: 'none',
                px: 0,
                justifyContent: 'flex-end',
                width: '100%',
                transition: 'all 0s ease',
                '&:hover': { color: '#1fc3a1' },
                '&:active': { color: '#1fc3a1' },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    )
}

export const TypographyLogo = ({ fontStyle = 'bold', sx = {}, ...props }) => {
    return (
        <Typography
            fontStyle={fontStyle}
            fontWeight={600}
            sx={{ fontSize: { xs: 13, sm: 14 }, ...sx }}
            {...props}
        />
    )
}

// Thanh nav ngang cho mobile (xs), nằm đè lên vùng logo
export const MobileNavBar = ({ open, children, sx = {}, ...props }) => {
    return (
        <Box
            component="nav"
            aria-hidden={!open}
            sx={{
                position: 'absolute', // định vị theo AppBar (đang fixed)
                top: 0,
                bottom: 0,
                left: 20,
                right: 56, // chừa chỗ cho nút menu / X
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: open ? 1 : 0,
                transform: open ? 'translateX(0)' : 'translateX(24px)',
                pointerEvents: open ? 'auto' : 'none',
                transition: 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                ...sx,
            }}
            {...props}
        >
            {children}
        </Box>
    )
}

export const MobileNavItem = ({ active = false, open = false, index = 0, sx = {}, ...props }) => {
    const delay = open ? `${0.05 * index}s` : '0s';
    return (
        <Box
            sx={{
                px: 0.75,
                py: 0.5,
                textAlign: 'center',
                textDecoration: 'none',
                color: 'black',
                fontSize: 10.5,
                fontWeight: active ? 700 : 700,
                letterSpacing: '0.03em',
                whiteSpace: 'nowrap',
                borderRadius: '20px',
                backgroundColor: active ? 'rgba(0,0,0,0.08)' : 'transparent',
                opacity: open ? 1 : 0,
                transform: open ? 'translateX(0)' : 'translateX(12px)',
                transition: `opacity 0.3s ease ${delay}, transform 0.35s ease ${delay}`,
                WebkitTapHighlightColor: 'transparent',
                ...sx,
            }}
            {...props}
        />
    )
}