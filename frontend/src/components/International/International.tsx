import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Public, AssuredWorkload, Translate } from '@mui/icons-material';

const internationalData = [
  {
    icon: <Public fontSize="large" color="primary" />,
    title: 'Глобальный охват',
    description: 'Работаем с клиентами из более чем 15 стран мира.',
  },
  {
    icon: <AssuredWorkload fontSize="large" color="primary" />,
    title: 'Соответствие стандартам',
    description: 'Наши решения соответствуют международным стандартам, включая GDPR и ISO 27001.',
  },
  {
    icon: <Translate fontSize="large" color="primary" />,
    title: 'Мультиязычная поддержка',
    description: 'Оказываем поддержку на русском, английском и немецком языках.',
  },
];

const International: React.FC = () => {
  return (
    <Box sx={{ py: 6 }}>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
        Международный опыт
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {internationalData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: 'transparent',
              }}
            >
              <Box mb={2}>{item.icon}</Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {item.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default International; 