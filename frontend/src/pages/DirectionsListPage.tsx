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
    fetch('http://localhost:3001/api/directions')
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
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
          gap: 3,
        }}
      >
        {safeDirections.map((direction) => (
          <Box
            key={direction.id}
            sx={{
              gridColumn: { xs: 'span 12', md: direction.gridSize === 2 ? 'span 8' : 'span 4' },
            }}
          >
            <Box component={RouterLink} to={`/projects?directionId=${direction.id}`} sx={{ textDecoration: 'none', display: 'block', height: '100%' }}>
              <Card
                sx={{
                  height: '100%',
                  background: direction.bgColor,
                  color: direction.textColor,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
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
                      flex: 1,
                      opacity: 0.9,
                    }}
                  >
                    {direction.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
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