import { AppBar } from "@mui/material"


export const StyleAppBar = ({ children, position = 'static', sx = {}, ...props }) => {
    return (
        <AppBar
            position={position}
            sx={(theme) => ({
                backgroundColor: '#000000',
                [theme.breakpoints.down('lg')]: {
                    height: 100,
                }
            })} {...props} >

            {children}
        </AppBar>
    )
}