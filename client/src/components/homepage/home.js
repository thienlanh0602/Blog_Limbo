import { Typography, Skeleton } from '@mui/material';


//text title
const isDesktopTitle = 150;
const isTabletTitle = 100;
const isMobileTitle = 50;

//text context
const isDesktopContext = 30;
const isTabletContext = 20;
const isMobileContext = 10;


//styletitle
export const StyleTypography_1 = ({ children, variant = 'h1', gutterBottom = false, sx = {}, ...props }) => {
    return (
        <Typography gutterBottom={gutterBottom}
            sx={{
                fontSize: {
                    xs: isMobileTitle,    // điện thoại
                    sm: isTabletTitle,   // tablet
                    md: isDesktopTitle,// desktop

                },
            }} {...props} >

            {children}
        </Typography>
    )
}

export const StyleTypography_2 = ({ children, gutterBottom = false, sx = {}, ...props }) => {
    return (
        <Typography gutterBottom={gutterBottom}
            sx={{
                fontSize: {
                    xs: isMobileContext,    // điện thoại
                    sm: isTabletContext,   // tablet
                    md: isDesktopContext,// desktop

                },
            }} {...props} >

            {children}
        </Typography>
    )
}

export const StyleSkeleton_1 = ({ variant = 'text', width = 300, height = 40, ...props }) => {
    return (
        <Skeleton
            variant={variant}
            width={width}
            height={height}

            {...props}

        />
    )
}
export const StyleSkeleton_2 = ({ variant = 'rectangular', width = 600, height = 300, sx = {}, ...props }) => {
    return (
        <Skeleton
            variant={variant}
            width={width}
            height={height}
            sx={{ mt: 2, ...sx }}
            {...props}

        />
    )
}


