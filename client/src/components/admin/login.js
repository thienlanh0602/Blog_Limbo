import { Button, TextField, Typography } from "@mui/material"

export const TextFieldLoginPw = ({ children, sx = {}, ...props }) => {
    return (
        <TextField
            fullWidth
            placeholder="Password"
            type="password"
            name="password"
            margin="normal"
            required
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
            {...props}>
            {children}
        </TextField >

    )
}

export const TextFieldLoginUser = ({ children, sx = {}, ...props }) => {
    return (
        <TextField
            fullWidth
            placeholder="Username"
            name="username"
            margin="normal"
            required
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
            {...props}>
            {children}
        </TextField >

    )
}

export const StyleButtonLogin = ({ children, variant = 'container', sx = {}, ...props }) => {
    return (
        <Button
            variant={variant}
            sx={{
                backgroundColor: '#4efcd3',
                border: '2px solid black',
                boxShadow: '3px 3px 0px black',
                borderRadius: 0,
                minWidth: 120,
                minHeight: 60,
                color: 'black',
                mt: 2,
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

export const StyleTyp = ({ variant = 'h4', sx = {}, ...props }) => {
    return (
        <Typography
            gutterBottom
            variant={variant}
            sx={{
                flexGrow: 1,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}{...props} />

    )
}