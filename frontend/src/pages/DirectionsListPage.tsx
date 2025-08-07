import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Button,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface Direction {
  id: number;
  title: string;
  description: string;
  gridSize: number;
  textColor: string;
  bgColor: string;
}

const DirectionsListPage: React.FC = () => {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [directionsError, setDirectionsError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/directions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDirections(data);
          setDirectionsError(null);
        } else {
          setDirections([]);
          setDirectionsError('Ошибка загрузки направлений');
        }
      })
      .catch(() => {
        setDirections([]);
        setDirectionsError('Ошибка загрузки направлений');
      });
  }, []);

  const safeDirections: Direction[] = Array.isArray(directions) ? directions : [];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ mb: 3 }}>
        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
          sx={{ borderRadius: 999, px: 3 }}
        >
          ← На главную
        </Button>
      </Box>
      
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: 32, md: 48 },
            mb: 2,
            color: 'primary.main',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          Направления работы
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
            fontSize: { xs: 16, md: 18 },
            lineHeight: 1.6,
          }}
        >
          Мы специализируемся на различных направлениях IT-разработки и предлагаем комплексные решения для вашего бизнеса
        </Typography>
      </Box>

      {directionsError && (
        <Alert severity="error" sx={{ mb: 2 }}>{directionsError}</Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {safeDirections.map((direction) => (
          <Box
            key={direction.id}
            component={RouterLink}
            to={`/projects?directionId=${direction.id}`}
            sx={{
              textDecoration: 'none',
              display: 'block',
              width: '100%',
            }}
          >
              <Card
                sx={{
                  background: direction.bgColor,
                  color: direction.textColor,
                  borderRadius: 1,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                  transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  },
                }}
              >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                        mb: 1,
                      fontSize: { xs: 20, md: 24 },
                      lineHeight: 1.2,
                    }}
                  >
                    {direction.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: 14, md: 16 },
                      lineHeight: 1.6,
                      opacity: 0.9,
                    }}
                  >
                    {direction.description}
                  </Typography>
                  </Box>
                  <Box sx={{ ml: 2, display: { xs: 'none', md: 'block' } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.7,
                        fontSize: 14,
                      }}
                    >
                      →
                    </Typography>
                  </Box>
                </Box>
                </CardContent>
              </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 8 } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: 'text.primary',
          }}
        >
          Нужна консультация по направлению?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 500,
            mx: 'auto',
            fontSize: { xs: 16, md: 18 },
            lineHeight: 1.6,
          }}
        >
          Свяжитесь с нами, и мы поможем выбрать оптимальное решение для вашего проекта
        </Typography>
      </Box>
    </Container>
  );
};

export default DirectionsListPage; 