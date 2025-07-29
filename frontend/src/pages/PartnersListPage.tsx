import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  Tooltip
} from '@mui/material';

const API_URL = 'http://localhost:3001/api/partners';

interface Partner {
  id: number;
  name: string;
  logo: string;
}

const PartnersListPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get<Partner[]>(API_URL);
        setPartners(response.data);
      } catch (error) {
        console.error('Failed to fetch partners', error);
      }
    };

    fetchPartners();
  }, []);

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Наши партнеры
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
        Мы сотрудничаем с лидерами индустрии для предоставления лучших решений нашим клиентам.
      </Typography>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4}>
        {partners.map((partner) => (
          <Box key={partner.id} sx={{ width: { xs: '40%', sm: '20%', md: '15%' } }}>
            <Tooltip title={partner.name} arrow>
              <Card sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  p: 2, 
                  height: 120,
                  filter: 'grayscale(100%)',
                  transition: 'filter 0.3s ease-in-out',
                  '&:hover': {
                      filter: 'grayscale(0%)',
                  }
                }}>
                <CardMedia
                  component="img"
                  image={partner.logo}
                  alt={partner.name}
                  sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </Card>
            </Tooltip>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default PartnersListPage; 