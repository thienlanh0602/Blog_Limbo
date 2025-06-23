import { createTheme } from '@mui/material/styles';
import { breakpoints } from './breakpoints';
const theme = createTheme({
  breakpoints, //kich thuoc man hinh
  typography: {
    fontFamily: 'Kanit, sans-serif',
  },
});

export default theme;