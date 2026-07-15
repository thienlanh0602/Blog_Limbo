import { Typography, Skeleton, Button, Box } from '@mui/material';

export const commonSxDisplay = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};


export const StyleTypography_Title = ({ children, sx = {}, ...props }) => {
    return (
        <Typography
            fontWeight={800}
            textTransform="uppercase"
            sx={{
                fontSize: { xs: 24, sm: 28, md: 34 },
                px: { xs: 2, md: 0 },
                ...sx,
            }}
            {...props}>
            {children}
        </Typography>
    )
}

export const StyleTypography_Text = ({ children, gutterBottom = false, sx = {}, ...props }) => {
    return (
        <Typography gutterBottom={gutterBottom}
            fontWeight={200}
            sx={(theme) => ({
                fontSize: { xs: 14, md: 16 },
                position: "relative",
                maxWidth: { xs: 300, sm: 400, md: 'none' },
                whiteSpace: { xs: 'normal', md: 'normal' },
                px: { xs: 2, md: 0 },
                zIndex: 1,
                ...sx,
            })}
            {...props} >

            {children}
        </Typography>
    )
}
export const StyleTypography_3 = ({ children, fontStyle = 'bold', gutterBottom = false, sx = {}, ...props }) => {
    return (
        <Typography gutterBottom={gutterBottom}
            fontStyle={fontStyle}
            fontWeight={700}
            textTransform='uppercase'
            sx={{
                fontSize: { xs: 14, md: 16 },
                ...sx,
            }}

            {...props} >

            {children}
        </Typography>
    )
}

const StyleTypography_4 = ({ children, fontStyle = 'bold', gutterBottom = false, sx = {}, ...props }) => {
    return (
        <Typography gutterBottom={gutterBottom}
            fontStyle={fontStyle}
            fontWeight={700}
            textTransform='uppercase'
            sx={{
                fontSize: { xs: 14, md: 16 },
                ...sx,
            }}

            {...props} >

            {children}
        </Typography>
    )
}
const StyleSkeleton_1 = ({ variant = 'text', width = 300, height = 40, ...props }) => {
    return (
        <Skeleton
            variant={variant}
            width={width}
            height={height}
            {...props}

        />
    )
}
const StyleSkeleton_2 = ({ sx = {}, ...props }) => {
    return (
        <Skeleton
            variant={'rectangular'}
            width="100%"
            height={300}
            sx={{ mt: 2, maxWidth: 600, ...sx }}
            {...props}
        />
    )
}

const ButtonHomeImage = ({ children, sx = {}, ...props }) => {
    return (
        <Button
            sx={{
                backgroundColor: '#4efcd3',
                border: '2px solid black',
                borderRadius: 0,
                minWidth: { xs: 120, md: 140 },
                minHeight: { xs: 44, md: 50 },
                color: 'black',
                boxShadow: '3px 3px 0px black',
                zIndex: 1,
                mt: 2,
                ...sx,
            }} {...props}>
            {children}
        </Button>
    )
}
export const BoxImageHome = ({ sx = {}, ...props }) => {
    return (
        <Box
            sx={{
                width: { xs: 16, md: 20 },
                height: { xs: 16, md: 20 },
                ...sx,
            }} {...props} />


    )
}

