import { Typography } from "@mui/material";

export const Context = ({ children, bp, sx = {}, ...props }) => {

    return (
        <Typography
            gutterBottom={false}
            fontWeight={200}
            sx={{
                fontSize: { xs: 14, md: 16 },
                position: "relative",
                maxWidth: { xs: 280, sm: 320, md: 'none' },
                whiteSpace: 'normal',
                px: { xs: 2, md: 0 },
                zIndex: 1,
                ...sx,
            }}
            {...props} >

            {children}
        </Typography>
    )
}
