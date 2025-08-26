import { Box, Button, Container } from "@mui/material"

const commonBorder = '2px solid black'
const commonBoxShadow = '3px 3px 0px black'

export const StyleContainer = ({ children, variant = 'container', sx = {}, ...props }) => (
    <Container
        variant={variant}
        sx={{
            width: 280,          
            height: '100vh',
            py: 8,
            position: 'fixed',
            top: 0,
            left: 0,
            borderRight: commonBorder,
            ...sx
        }}
        {...props}
    >
        {children}
    </Container>
)

export const ButtonNav = ({ children, sx = {}, ...props }) => (
    <Button
        fullWidth
        sx={{
            border: commonBorder,
            backgroundColor: '#D9D9D9',
            color: 'black',
            borderRadius: 0,
            boxShadow: commonBoxShadow,
            py: 0.8,
            fontWeight: 600,
            ...sx
        }}
        {...props}
    >
        {children}
    </Button>
)

export const BoxNavButton = ({ children, sx = {}, ...props }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
            ...sx
        }}
        {...props}
    >
        {children}
    </Box>
)
