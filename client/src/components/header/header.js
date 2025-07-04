import { AppBar, Box, Button, Container, Drawer, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material"


// map


// // boc header bang appbar
// <StyleAppBar>
//     {/* sau do boc bang toobar */}
//     <StyleToolbar>
//         {/* boc cac thanh phan bang container */}
//         <StyleContainer>
//             {/* logo */}
//             <BoxLogo />
//             {/* thanh phan nav */}
//             <BoxNav />
//             {/* dieu huong */}
//             <ButtonImage />
//         </StyleContainer>
//     </StyleToolbar>
// </StyleAppBar>


// -------------------------------------------------------------
export const StyleAppBar = ({
    children,
    position = 'fixed',
    sx = {}, ...props }) => {
    return (
        <AppBar
            position={position}
            sx={(theme) => ({
                color: "black",
                boxShadow: 'none',
                borderBottom: 'none',
                backgroundColor: '#ffffff',
                [theme.breakpoints.down('ay')]: {
                    backgroundColor: '#000000'
                },
                pt: 8 // khoảng cách appbar với top
            })} {...props} >

            {children}
        </AppBar>
    )
}

export const StyleToolbar = ({ children, sx = {}, ...props }) => {
    return (
        <Toolbar
            disableGutters
            sx={() => ({

            })} {...props}>
            {children}
        </Toolbar>
    )
}

export const StyleContainer = ({ children, sx = {}, ...props }) => {
    const theme = useTheme();
    const isDektop = useMediaQuery(theme.breakpoints.down('lg'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isTablet2 = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    let maxWidth = 'lg';
    if (isDektop) maxWidth = 'ay';
    if (isTablet) maxWidth = 'sm';
    if (isTablet2) maxWidth = 'md';
    if (isMobile) maxWidth = 'xs';

    return (
        <Container
            maxWidth={maxWidth}
            disableGutters
            sx={() => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 5,
            })} {...props}>
            {children}
        </Container>
    )
}

//box logo
export const BoxLogo = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            sx={() => ({
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1
            })}
            {...props}
        >
            {children}
        </Box>
    )
}

// box element nav
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

// element nav button 
export const ButtonNav = ({ children, color = 'inherit', sx = {}, ...props }) => {
    return (
        <Button
            color={color}
            sx={{
                display: 'flex',
                fontSize: 18,
                flexDirection: 'column',
                textTransform: 'none',
                px: 0,
                justifyContent: 'flex-end',
                width: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                    color: '#1fc3a1',
                },
                '&:active': {
                    color: '#1fc3a1',
                },
            }} {...props}>
            {children}
        </Button>
    )
}

// button image sử dụng cho nhiều button 
export const ButtonImage = ({ children, maxwith = 'lg', sx = {}, ...props }) => {
    return (
        <Button
            sx={() => ({
                backgroundColor: '#4efcd3',
                border: '1px solid black',
                borderRadius: 5,
                minWidth: 50,
                minHeight: 30,
                color: 'black',

            })} {...props}>
            {children}
        </Button>
    )
}

// image arrow
export const BoxImage = ({ maxwith = 'lg', sx = {}, ...props }) => {
    return (
        <Box
            sx={() => ({
                width: 10,
                height: 10,
            })} {...props} />
    )
}

// text limbo
export const TypographyLogo = ({ fontStyle = 'bold', ...props }) => {
    return (
        <Typography
            fontStyle={fontStyle}
            fontWeight={600}
            {...props} />
    )
}

// dieu chinh drawer 
export const EditDrawer = ({ children, sx = {}, ...props }) => {
    return (
        <Drawer
            anchor="right"
            transitionDuration={0}
            PaperProps={{
                sx: {
                    height: 'auto',
                    position: 'absolute',
                    backgroundColor: '#000',
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    boxShadow: 5,
                    borderRadius: 5,
                    top: 120,
                    right: 40,
                    px: 4,
                    py: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                },
            }}
            ModalProps={{
                BackdropProps: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.03)'
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