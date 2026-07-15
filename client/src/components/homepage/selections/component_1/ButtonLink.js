import { Button } from "@mui/material";

export const ButtonLink = ({ children, sx = {}, ...props }) => {

    return (
        <Button
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => e.currentTarget.blur()}
            sx={{
                mt: 1,
                minWidth: { xs: 120, md: 150 },
                minHeight: { xs: 44, md: 50 },
                borderRadius: 0,
                fontSize: { xs: 14, md: 16 },
                color: "black",
                backgroundColor: "#4efcd3",
                border: "2px solid black",
                boxShadow: "3px 3px 0px black",
                zIndex: 1,
                "&:hover": { backgroundColor: "#4efcd3" },
                "&:active": {
                    backgroundColor: "#4efcd3",
                    boxShadow: "1px 1px 0px black",
                    transform: "translate(1px, 1px)",
                },
                ...sx,
            }}
            {...props} >

            {children}
        </Button>
    )
}
