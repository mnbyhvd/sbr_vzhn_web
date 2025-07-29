import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A59DE', // акцентный
      contrastText: '#fff',
    },
    secondary: {
      main: '#A4C2E8', // второй акцентный
      contrastText: '#0D2C75',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    text: {
      primary: '#0D2C75', // тёмный для текста
      secondary: '#1A59DE',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h1: { color: '#0D2C75' },
    h2: { color: '#0D2C75' },
    h3: { color: '#0D2C75' },
    h4: { color: '#0D2C75' },
    h5: { color: '#0D2C75' },
    h6: { color: '#0D2C75' },
    body1: { color: '#0D2C75' },
    body2: { color: '#0D2C75' },
  },
  shape: {
    borderRadius: 20, // для скруглённых блоков
  },
});

export default theme; 