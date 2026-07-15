import { Typography } from "@mui/material";

export const ContextTag = ({ sx = {}, ...props }) => {

    return (
        <Typography
            variant="h6"
            sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#4DF4C8",
            }}
            {...props} >

        </Typography>
    )
}