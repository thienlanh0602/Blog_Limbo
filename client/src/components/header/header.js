import { AppBar, Box, Button, Container, Drawer, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material"

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
                width: { xs: "92%", sm: "85%", md: "80%" },
                maxWidth: scrolled ? { xs: 94, sm: 110, md: 142 } : 1000,
                borderRadius: { xs: "30px", md: "50px" },
                border: "1px solid black",
                boxShadow: "none",
                backgroundColor: "#ffffff",
                color: "black",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: 1200,
                py: 0,
                ...sx,
            }} {...props}>
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
                ...sx
            }}
            {...props}>
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
            }} {...props}>
            {children}
        </Container>
    )
}

export const BoxLogo = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1,
                color: 'black'
            }}
            {...props}
        >
            {children}
        </Box>
    )
}

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
            })} {...props}>
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
                fontSize: { xs: 14, sm: 16 },
                flexDirection: 'column',
                textTransform: 'none',
                px: 0,
                justifyContent: 'flex-end',
                width: '100%',
                transition: 'all 0s ease',
                '&:hover': {
                    color: '#1fc3a1',
                },
                '&:active': {
                    color: '#1fc3a1',
                },
                ...sx,
            }}
            {...props}>
            {children}
        </Button>
    )
}

export const ButtonImage = ({ children, sx = {}, ...props }) => {
    return (
        <Button
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => e.currentTarget.blur()}
            sx={{
                backgroundColor: '#4efcd3',
                border: '1px solid black',
                borderRadius: 0,
                minWidth: { xs: 40, sm: 45 },
                minHeight: { xs: 22, sm: 25 },
                color: 'black',
                boxShadow: '3px 3px 0px black',

                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                userSelect: 'none',
                "&:hover": { backgroundColor: "#4efcd3" },
                "&:active": {
                    backgroundColor: "#4efcd3",
                    boxShadow: "1px 1px 0px black",
                    transform: "translate(1px, 1px)",
                },
                ...sx,
            }}
            {...props} >

            {children}
        </Button>
    )
}

export const BoxImage = ({ sx = {}, ...props }) => {
    return (
        <Box
            sx={{
                width: 10,
                height: 10,
                ...sx,
            }} {...props} />
    )
}

export const TypographyLogo = ({ fontStyle = 'bold', sx = {}, ...props }) => {
    return (
        <Typography
            fontStyle={fontStyle}
            fontWeight={600}
            sx={{ fontSize: { xs: 14, sm: 16 }, ...sx }}
            {...props} />
    )
}

export const EditDrawer = ({ children, sx = {}, onClose, ...props }) => {
    const theme = useTheme();

    const handleClose = (event, reason) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        if (onClose) onClose(event, reason);
    };

    return (
        <Drawer
            anchor="right"
            hideBackdrop={false}
            transitionDuration={0}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    height: 'auto',
                    position: 'absolute',
                    backgroundColor: '#ffffff',
                    boxShadow: "3px 3px 0px black",
                    border: "1px solid black",
                    top: { xs: 74, sm: 100, md: 120 },
                    right: { xs: 14, sm: 24, md: 40 },
                    px: { xs: 2, sm: 3, md: 4 },
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                },
            }}
            ModalProps={{
                keepMounted: false,
                disableScrollLock: true,
                disableRestoreFocus: true,
                disableEnforceFocus: true,
                BackdropProps: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.07)',
                        backdropFilter: 'blur(1.3px)'
                    },
                },
            }}
            {...props}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
            }}>
                {children}
            </Box>
        </Drawer>
    )
}
