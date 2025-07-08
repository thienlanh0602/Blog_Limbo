import { Button, Container } from "@mui/material"

export const StyleContainer = ({ children, variant = 'container', sx = {}, ...props }) => {
    return (
        <Container
            variant={variant}
            sx={{
                width: 240,           // Chiều rộng sidebar phải trùng với drawerWidth
                height: '100vh',
                p: 2,
                py: 8,
                position: 'fixed',
                top: 0,
                left: 0,
                borderRight: '1px solid #d1d5db',
            }}
            {...props}>
            {children}
        </Container >

    )
}