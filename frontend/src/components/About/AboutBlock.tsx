import React from 'react';
import { Box, Typography } from '@mui/material';

const AboutBlock: React.FC = () => (
  <Box
    sx={{
      maxWidth: 1100,
      mx: 'auto',
      mt: { xs: -4, md: -8 }, // минимальный наезд
      mb: { xs: 6, md: 10 },
      borderRadius: { xs: '24px', md: '40px' },
      background: '#fff',
      boxShadow: '0 8px 48px 0 rgba(26,89,222,0.10)',
      px: { xs: 3, md: 8 },
      py: { xs: 4, md: 7 },
      position: 'relative',
      zIndex: 2,
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontWeight: 900,
        fontSize: { xs: 26, md: 36 },
        color: 'primary.main',
        mb: 3,
        letterSpacing: '-0.01em',
      }}
    >
      Основа и расположение
    </Typography>
    <Typography
      sx={{
        color: '#0D2C75',
        fontSize: { xs: 16, md: 20 },
        fontWeight: 400,
        lineHeight: 1.6,
        letterSpacing: '-0.01em',
      }}
    >
      Компания была создана в 1999 году для выполнения нестандартных проектов и оказания консультационных услуг в области ИТ. Офис находится в городе Долгопрудный рядом с Московским физико-техническим институтом (МФТИ). Персонал состоит из высокообразованных, подготовленных и опытных специалистов, основу штата составляют выпускники МФТИ. Компания осуществляет активное сотрудничество с МФТИ по академической и научной части.
    </Typography>
  </Box>
);

export default AboutBlock; 