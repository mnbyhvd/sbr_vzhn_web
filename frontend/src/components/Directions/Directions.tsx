import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/directions';

interface Direction {
    id: number;
    title: string;
    description: string;
    gridSize: number;
}

const Directions: React.FC = () => {
    const [directions, setDirections] = useState<Direction[]>([]);

    useEffect(() => {
        const fetchDirections = async () => {
            try {
                const response = await axios.get(API_URL);
                setDirections(response.data);
            } catch (error) {
                console.error('Failed to fetch directions:', error);
            }
        };

        fetchDirections();
    }, []);

  return (
    <Box sx={{ py: 8, background: '#fff' }}>
      <Button component={Link} to="/" variant="outlined" sx={{ mb: 4, ml: 4 }}>
        На главную
      </Button>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 700 }}>
        Наши направления
      </Typography>
      <Box display="flex" flexWrap="wrap" mt={3} sx={{ gap: 3, justifyContent: 'center' }}>
        {directions.map((direction, index) => (
          <Paper
            key={index}
            sx={{
              width: 320,
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: '0 8px 32px rgba(45,91,255,0.12)' },
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            component={Link}
            to={`/projects?directionId=${direction.id}`}
          >
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              {direction.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {direction.description}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Directions; 