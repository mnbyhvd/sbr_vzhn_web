import { useTheme } from '@mui/material';
import { useColors } from '../contexts/ColorContext';

export const useSiteColors = () => {
  const theme = useTheme();
  const { colors, isHomePage } = useColors();

  // Возвращаем цвета в зависимости от страницы
  return {
    primary: isHomePage ? colors.primary : theme.palette.primary.main,
    secondary: isHomePage ? colors.secondary : theme.palette.secondary.main,
    background: isHomePage ? colors.background : theme.palette.background.default,
    text: isHomePage ? colors.text : theme.palette.text.primary,
    footerBg: isHomePage ? colors.footerBg : theme.palette.primary.main,
    footerText: isHomePage ? colors.footerText : '#fff',
    isHomePage,
  };
}; 