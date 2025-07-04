import { Button, Typography } from "@mui/material"



export const StyleButton = ({ children, variant = 'container', sx = {}, ...props }) => {
    return (
        <Button
            variant={variant}
            sx={{
                backgroundColor: '#4efcd3',
                border: '2px solid black',
                borderRadius: 10,
                minWidth: 100,
                minHeight: 50,
                color: 'black',
            }}{...props}>
            {children}
        </Button >

    )
}

export const StyleTyp = ({ variant = 'h4', sx = {}, ...props }) => {
    return (
        <Typography
            variant={variant}
            sx={{
                flexGrow: 1,
                fontWeight: 700
            }}{...props} />

    )
}
