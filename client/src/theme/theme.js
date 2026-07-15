import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Kanit, sans-serif',
    fontSize: 16,
    body1: {
      fontSize: '16px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: 0,
          minWidth: 'auto',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          textTransform: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
          '&:focus': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

export default theme;
