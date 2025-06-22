import { Typography, Skeleton } from '@mui/material';


//styletitle
export const StyleTypography = ({ children, variant = 'h5', gutterBottom = false, ...props }) => {
    return (
        <Typography variant={variant} gutterBottom={gutterBottom} {...props} >

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


