import { Box, Button, Container } from "@mui/material"
import { DRAWER_WIDTH } from "../../theme/breakpoints";

const commonBorder = '2px solid black'
const commonBoxShadow = '3px 3px 0px black'

export const StyleContainer = ({ children, variant = 'container', isMobile = false, sx = {}, ...props }) => (
    <Container
        variant={variant}
        disableGutters
        sx={{
            width: DRAWER_WIDTH,
            height: isMobile ? '100%' : '100vh',
            py: { xs: 4, md: 8 },
            position: isMobile ? 'relative' : 'fixed',
            top: 0,
            left: 0,
            borderRight: commonBorder,
            overflowY: 'auto',
            boxSizing: 'border-box',
            px: { xs: 2, md: 3 },
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
            fontSize: { xs: 14, md: 16 },
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
