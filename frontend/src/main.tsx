import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import './i18n';
import { ColorProvider } from './contexts/ColorContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorProvider>
  </React.StrictMode>
);
