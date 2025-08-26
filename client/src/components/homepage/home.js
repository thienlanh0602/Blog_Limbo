import { Typography, Skeleton, Button, Box } from '@mui/material';

//styletitle
export const StyleTypography_1 = ({ children, fontStyle = 'bold', gutterBottom = false, sx = {}, ...props }) => {
    return (
        <Typography gutterBottom={gutterBottom}
            fontStyle={fontStyle}
            fontWeight={800}
            textTransform='uppercase'
            letterSpacing={-11}
            lineHeight={1}
            sx={(theme) => ({
                fontSize: 190,
                [theme.breakpoints.down('md')]: {
                    fontSize: 140,
                },
                zIndex: 1
            })}

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
                fontSize: 16,
                position: "relative",

            }}

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
                fontSize: 16,
            }}

            {...props} >

            {children}
        </Typography>
    )
}

export const StyleTypography_4 = ({ children, fontStyle = 'bold', gutterBottom = false, sx = {}, ...props }) => {
    return (
        <Typography gutterBottom={gutterBottom}
            fontStyle={fontStyle}
            fontWeight={700}
            textTransform='uppercase'
            sx={{
                fontSize: 16,
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
                borderRadius: 0,
                minWidth: 140,
                minHeight: 50,
                color: 'black',
                boxShadow: '3px 3px 0px black',
                zIndex: 1,
                mt: 2
            })} {...props}>
            {children}
        </Button>
    )
}
export const BoxImageHome = ({ maxwith = 'lg', sx = {}, ...props }) => {
    return (
        <Box
            sx={() => ({
                width: 20,
                height: 20,
            })} {...props} />


    )
}


