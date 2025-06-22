import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routers from './router/Router';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Routers />
    </ThemeProvider>
  </React.StrictMode>

);

