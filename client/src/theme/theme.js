import { createTheme } from '@mui/material/styles';
import { breakpoints } from './breakpoints';
const theme = createTheme({
  breakpoints, //kich thuoc man hinh
  typography: {
    fontFamily: 'Kanit, sans-serif',
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
            backgroundColor: 'transparent',
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

