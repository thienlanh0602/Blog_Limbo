import { Typography } from "@mui/material";
import { keyframes } from "@emotion/react";

const floatAnimation = keyframes`
    0% {
        transform: translate(0px, 0px);
    }
    25% {
        transform: translate(8px, -14px);
    }
    50% {
        transform: translate(-6px, 2px);
    }
    75% {
        transform: translate(6px, 12px);
    }
    100% {
        transform: translate(0px, 0px);
    }
`;

export const TextTitle = ({ children, bp, sx = {}, ...props }) => {

    return (
        <Typography
            gutterBottom={false}
            fontStyle={'bold'}
            fontWeight={800}
            textTransform='uppercase'
            lineHeight={1}
            sx={{
                marginTop: { xs: 4, sm: 6, md: 16 },
                fontSize: { xs: 64, sm: 120, md: 190 },
                letterSpacing: { xs: '-4px', sm: '-6px', md: '-11px' },
                zIndex: 1,

                willChange: "transform",
                animation: `${floatAnimation} 7s ease-in-out infinite`,

                ...sx,
            }}
            {...props} >

            {children}
        </Typography>
    )
}