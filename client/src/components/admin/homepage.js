import { Box, Button, Card, Container, Dialog, DialogContent, Menu, MenuItem, TextField, Typography } from "@mui/material"


// ======= Homepage title =======

export const BoxHomepage = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            display={'flex'}
            flexWrap={'wrap'}
            gap={2}
            my={4}
            mx={5}
            {...props}>
            {children}
        </Box >

    )
}

export const StyleTyp = ({ variant = 'h6', sx = {}, ...props }) => {
    return (
        <Typography
            variant={variant}
            sx={{
                flexGrow: 1,
                fontWeight: 700
            }}{...props} />

    )
}


export const StyleButton = ({ children, variant = 'container', sx = {}, ...props }) => {
    return (
        <Button
            variant={variant}
            sx={{
                backgroundColor: '#4efcd3',
                border: '2px solid black',
                boxShadow: '3px 3px 0px black',
                borderRadius: 0,
                minWidth: 120,
                minHeight: 20,
                color: 'black',
                fontSize: 16,
                '&:hover': {
                    backgroundColor: '#4efcd3',
                    boxShadow: '3px 3px 0px black',
                },
                '&:active': {
                    backgroundColor: '#4efcd3',
                    boxShadow: '1px 1px 0px black',
                    transform: 'translate(1px, 1px)',
                },
            }}{...props}>
            {children}
        </Button >

    )
}

// ======= Thêm và sửa =======

export const StyleDailog = ({ children, sx = {}, ...props }) => {
    return (
        <Dialog
            fullWidth
            maxWidth='md'
            disableRestoreFocus
            PaperProps={{
                sx: {
                    boxShadow: 'none',
                    border: '2px solid black',
                    borderRadius: '0px',
                },
            }}
            {...props}>
            {children}
        </Dialog >

    )
}

export const StyleContainerDailog = ({ children, sx = {}, ...props }) => {
    return (
        <Container
            maxWidth={"md"}
            sx={{ py: '10px' }}
            {...props}>
            {children}
        </Container >

    )
}


export const StyleDialogContent = ({ children, sx = {}, ...props }) => {
    return (
        <DialogContent
            sx={{ pb: 0 }}
            {...props}>
            {children}
        </DialogContent >

    )
}

export const BoxTextField = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            sx={{ mb: 2 }}
            {...props}>
            {children}
        </Box >

    )
}

export const TypTextField = ({ sx = {}, ...props }) => {
    return (
        <Typography
            variant="body1"
            sx={{ mb: 0 }}
            {...props} />

    )
}

export const StyleTextField = ({
    label = 'Analogus',
    value,
    onChange,
    sx = {},
    multiline = true,

    ...props
}) => {
    return (
        <Box
            sx={{
                position: 'relative',
                display: 'inline-block',
                paddingTop: '6px',
                width: '100%',
                ...sx,
            }}
        >

            {/* TextField */}
            <TextField
                fullWidth
                variant="outlined"
                multiline={multiline}
                value={value}
                onChange={onChange}
                sx={{
                    '& .MuiOutlinedInput-root': {

                    },
                    '& fieldset': {
                        border: 'none',
                    },
                    border: '2px solid black',
                    borderRadius: '0',
                    backgroundColor: '#fff',
                    boxShadow: 'none',


                }}

                {...props}
            />
        </Box>
    );
};


export const BoxImgUpload = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            sx={{
                border: '2px dashed black',
                borderRadius: '20px',
                p: 2,
                mt: 1,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                alignItems: 'flex-start',
            }}
            {...props}>
            {children}
        </Box >

    )
}

export const ButtonImgUpload = ({ children, sx = {}, ...props }) => {
    return (
        <Button
            sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                minWidth: 30,
                height: 30,
                borderRadius: '50%',
                background: '#fff',
                border: '1px solid #ccc',
                zIndex: 2,
            }}
            {...props}>
            {children}
        </Button >

    )
}

export const ImgStyle = ({ children, style = {}, ...props }) => {
    return (
        <img
            style={{
                width: 150,
                height: 150,
                objectFit: 'contain',
                display: 'block',
                borderRadius: 8,
            }}
            {...props}>
            {children}
        </img >

    )
}

export const BoxImgMore = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            sx={{
                width: 150,
                height: 150,
                borderRadius: 3,
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': { backgroundColor: '#f3f4f6' },
            }}
            {...props}>
            {children}
        </Box >

    )
}

export const StyleInput = ({ children, style = {}, ...props }) => {
    return (
        <input
            multiple
            style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
            }}
            {...props}>
            {children}
        </input >

    )
}

export const BoxImgAdd = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            sx={{
                width: '100%',
                height: 150,
                borderRadius: 3,
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': { backgroundColor: '#f3f4f6' },
            }}
            {...props}>
            {children}
        </Box >

    )
}

export const BoxStyle = ({ children, sx = {}, ...props }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                my: 3,
                gap: 3
            }}
            {...props}>
            {children}
        </Box >

    )
}

export const BoxIcon = () => {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Box
                component="svg"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#9ca3af"
                sx={{ width: 40, height: 40, mb: 1 }}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                />
            </Box>
            <Typography variant="body2" color="#9ca3af">
                Upload photo
            </Typography>
        </Box>

    )
}

// ======= More =======

export const StyleButton_2 = ({ children, variant = 'container', sx = {}, ...props }) => {
    return (
        <Button
            variant={variant}
            sx={{
                backgroundColor: '#D9D9D9',
                border: '2px solid black',
                boxShadow: '3px 3px 0px black',
                borderRadius: 0,
                minWidth: 120,
                minHeight: 20,
                color: 'black',
                fontSize: 16,
                '&:hover': {
                    backgroundColor: '#D9D9D9',
                    boxShadow: '3px 3px 0px black',
                },
                '&:active': {
                    backgroundColor: '#D9D9D9',
                    boxShadow: '1px 1px 0px black',
                    transform: 'translate(1px, 1px)',
                },
            }}{...props}>
            {children}
        </Button >

    )
}


export const StyleCard = ({ children, sx = {}, ...props }) => {
    return (
        <Card
            sx={{
                width: 336,
                border: '2px solid black',
                boxShadow: '3px 3px black',
                borderRadius: 0,

                // boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}{...props}>
            {children}
        </Card >

    )
}

export const StyleCardContainer = ({ children, sx = {}, ...props }) => {
    return (

        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                width: '100%',
                justifyContent: 'center',
                py: 5
            }}
            {...props}
        >
            {children}
        </Box>




    );
};


export const StyleMenu = ({ children, sx = {}, ...props }) => {
    return (
        <Menu
            slotProps={{
                paper: {
                    sx: {
                        border: '2px solid black',
                        boxShadow: 'none',
                        borderRadius: 0,
                    },
                },
            }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}{...props}>
            {children}
        </Menu >

    )
}

export const StyleMenuItem = ({ children, sx = {}, ...props }) => {
    return (
        <MenuItem
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                fontWeight: 500,
                '&:hover': {
                    backgroundColor: 'transparent', // Không đổi màu khi hover
                },
            }}
            {...props}>
            {children}
        </MenuItem >

    )
}

export const ButtonMenu = ({ children, sx = {}, ...props }) => {
    return (
        <Button
            sx={{
                minWidth: 'auto', p: 0, border: '2px solid black',
                p: 0.5, bgcolor: '#D9D9D9',
                borderRadius: 0, px: 0.8
            }}{...props}>
            {children}
        </Button >

    )
}