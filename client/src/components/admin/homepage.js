import { Button, Card, Container, Menu, Typography } from "@mui/material"



export const StyleButton = ({ children, variant = 'container', sx = {}, ...props }) => {
    return (
        <Button
            variant={variant}
            sx={{
                backgroundColor: '#4efcd3',
                border: '2px solid black',
                boxShadow: '3px 3px 0px black',
                borderRadius: 0,
                minWidth: 120,
                minHeight: 20,
                color: 'black',
                fontSize: 16
            }}{...props}>
            {children}
        </Button >

    )
}

export const StyleTyp = ({ variant = 'h6', sx = {}, ...props }) => {
    return (
        <Typography
            variant={variant}
            sx={{
                flexGrow: 1,
                fontWeight: 700
            }}{...props} />

    )
}

export const StyleCard = ({ children, sx = {}, ...props }) => {
    return (
        <Card
            sx={{
                width: 336,
                border: '2px solid black',
                boxShadow: '3px 3px black',
                borderRadius: 0,
                
                // boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}{...props}>
            {children}
        </Card >

    )
}

export const StyleCardContainer = ({ children, sx = {}, ...props }) => {
    return (
        <Container
            sx={{
                // display: 'grid',
                // gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
                // gap: 5,
                // alignItems: 'start',
                // boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                display: 'flex', flexWrap: 'wrap', gap: 5
            }}{...props}>
            {children}
        </Container >

    )
}

export const StyleMenu = ({ children, sx = {}, ...props }) => {
    return (
        <Menu
            slotProps={{
                paper: {
                    sx: {
                        border: '2px solid black',

                        boxShadow: '0 4px 0px black',
                        borderRadius: 2,
                    },
                },
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right', // gốc nằm ở bên phải nút
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right', // menu bung từ phải sang trái
            }}{...props}>
            {children}
        </Menu >

    )
}

export const ButtonMenu = ({ children, sx = {}, ...props }) => {
    return (
        <Button
            sx={{
                minWidth: 'auto', p: 0, border: '2px solid black', 
                p: 0.5, bgcolor: '#D9D9D9', 
                borderRadius: 0, px: 0.8
            }}{...props}>
            {children}
        </Button >

    )
}


