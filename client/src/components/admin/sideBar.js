import { Box, Button, Container } from "@mui/material"

export const StyleContainer = ({ children, variant = 'container', sx = {}, ...props }) => {
    return (
        <Container
            fontWeight={400} fontSize={18}
            variant={variant}
            sx={{
                width: 280,           // Chiều rộng sidebar phải trùng với drawerWidth
                height: '100vh',
                py: 8,
                position: 'fixed',
                top: 0,
                left: 0,
                borderRight: '2px solid black',
            }}
            {...props}>
            {children}
        </Container >

    )
}

export const ButtonNav = ({ children, sx = {}, ...props }) => {
    return (
        <Button
            fullWidth
            sx={{
                border: '2px solid black',
                backgroundColor: '#D9D9D9',
                color: 'black',
                borderRadius: '0px',
                border: '2px solid black',
                boxShadow: '3px 3px 0px black',
                py: 0.8,
                fontWeight: 600,
            }}{...props}>
            {children}
        </Button >

    )
}

export const BoxNavButton = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2
            }}{...props}>
            {children}
        </Box >

    )
}