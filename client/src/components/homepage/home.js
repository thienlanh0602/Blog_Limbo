import { Typography, Skeleton, Button, Box } from '@mui/material';

//styletitle
export const StyleTypography_1 = ({ children, fontStyle = 'bold', gutterBottom = false, sx = {}, ...props }) => {
    return (
        <Typography gutterBottom={gutterBottom}
            fontStyle={fontStyle}
            fontWeight={800}
            textTransform='uppercase'
            letterSpacing={-11}
            sx={{
                fontSize: 190
            }}

            {...props} >

            {children}
        </Typography>
    )
}

export const StyleTypography_2 = ({ children, gutterBottom = false, sx = {}, ...props }) => {
    return (
       <Typography gutterBottom={gutterBottom}
            
            fontWeight={200}
            
            
            sx={{
                fontSize: 22
            }}

            {...props} >

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

export const ButtonHomeImage = ({ children, maxwith = 'lg', sx = {}, ...props }) => {
    return (
        <Button
            sx={() => ({
                backgroundColor: '#4efcd3',
                border: '2px solid black',
                borderRadius: 10,
                minWidth: 140,
                minHeight: 70,
                color: 'black',

            })} {...props}>
            {children}
        </Button>
    )
}
export const BoxImageHome = ({ maxwith = 'lg', sx = {}, ...props }) => {
    return (
        <Box
            sx={() => ({
                width: 30,
                height:30,
            })} {...props} />


    )
}


