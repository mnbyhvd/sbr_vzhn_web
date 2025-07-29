import React from 'react';
import { Box, Container, Typography, Button, useTheme } from '@mui/material';
import { useColors } from '../../contexts/ColorContext';

const Hero: React.FC = () => {
  const theme = useTheme();
  const { colors, isHomePage } = useColors();
  
  // Функция для скролла к форме
  const handleScrollToForm = () => {
    const form = document.getElementById('contact-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Используем цвета из админки только на главной странице
  const primaryColor = isHomePage ? colors.primary : theme.palette.primary.main;
  const backgroundColor = isHomePage ? colors.background : theme.palette.background.default;
  const textColor = isHomePage ? colors.text : theme.palette.text.primary;

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: 420, md: 540 },
        display: 'flex',
        alignItems: 'center',
        background: backgroundColor,
        pt: { xs: 8, md: 12 },
        pb: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        {/* Левый текстовый блок */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography
            variant="h2"
          sx={{
            fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.8rem' },
              color: primaryColor,
              mb: 2,
            letterSpacing: '-1px',
          }}
        >
            Добро пожаловать в СайберВижн
        </Typography>
          {/* Синий br-разделитель */}
          <Box sx={{ width: 64, height: 5, borderRadius: 3, background: primaryColor, mb: 3 }} />
        <Typography
          variant="h5"
          sx={{
              color: textColor,
              mb: 4,
              maxWidth: 480,
          }}
        >
          Мы создаём цифровые решения для бизнеса, которые меняют отрасли и делают мир технологичнее.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
              borderRadius: 999,
            px: 5,
              py: 1.5,
            fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: `0 4px 24px ${primaryColor}20`,
              alignSelf: { xs: 'center', md: 'flex-start' },
              mt: 2,
              backgroundColor: primaryColor,
              '&:hover': {
                backgroundColor: primaryColor,
                opacity: 0.9,
              },
            }}
            onClick={handleScrollToForm}
          >
            Связаться с нами и начать работу
          </Button>
        </Box>
        {/* Правый блок — PNG логотип */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0 }}>
          <Box
            sx={{
              width: { xs: 280, sm: 350, md: 400, lg: 450 },
              height: { xs: 280, sm: 350, md: 400, lg: 450 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <img
              src="/logo.png"
              alt="СайберВижн"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
              onError={(e) => {
                // Если изображение не загрузилось, показываем текст
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span style="color: ${primaryColor}; font-size: 2rem; font-weight: bold; text-align: center;">LOGO</span>`;
                }
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero; 