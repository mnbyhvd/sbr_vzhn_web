import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useSiteColors } from '../../hooks/useSiteColors';
import axios from 'axios';

interface Direction {
  id: number;
  title: string;
  description: string;
  gridSize: number;
  textColor: string;
  bgColor: string;
}

const DirectionsMosaic: React.FC = () => {
  const navigate = useNavigate();
  const { primary, isHomePage } = useSiteColors();
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/directions');
        setDirections(response.data);
      } catch (error) {
        console.error('Ошибка загрузки направлений:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDirections();
  }, []);

  const isLongText = (text: string) => text.length > 120;

  // Используем цвета из админки только на главной странице
  const getDirectionColors = (direction: Direction) => {
    if (isHomePage) {
      return {
        bgcolor: direction.bgColor,
        color: direction.textColor,
      };
    }
    // На других страницах используем стандартные цвета
    return {
      bgcolor: '#fff',
      color: primary,
    };
  };

  if (loading) {
    return (
      <Box sx={{ py: 6, background: 'transparent', textAlign: 'center' }}>
        <Typography>Загрузка направлений...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, background: 'transparent' }}>
      <Box sx={{ mb: 3, textAlign: 'left', pl: { xs: 2, md: 6 } }}>
        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: 28, md: 38 } }}>
          Наши направления
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'dense',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gridAutoRows: 'minmax(120px, auto)',
          gap: { xs: 2, md: '18px' },
          maxWidth: 1100,
          mx: 'auto',
          mb: 2,
        }}
      >
        {directions.map((dir) => {
          const align = isLongText(dir.description) ? 'flex-start' : 'center';
          const colors = getDirectionColors(dir);
          const gridColumn = dir.gridSize === 2 ? { xs: 'auto', md: 'span 2' } : { xs: 'auto', md: 'auto' };
          
          return (
            <Box
              key={dir.id}
              sx={{
                bgcolor: colors.bgcolor,
                color: colors.color,
                borderRadius: '32px',
                boxShadow: '0 8px 32px 0 rgba(26,89,222,0.08)',
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: align,
                justifyContent: align,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.03)' },
                fontFamily: 'inherit',
                gridColumn: gridColumn,
              }}
              onClick={() => navigate('/directions')}
            >
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: 22, md: 28, lg: 32 }, textAlign: align, color: colors.color }}>{dir.title}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 400, fontSize: { xs: 17, md: 19, lg: 20 }, opacity: 0.97, textAlign: align, color: colors.color }}>{dir.description}</Typography>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          sx={{ borderRadius: 999, px: 4, fontWeight: 700, fontSize: { xs: 18, md: 20 } }}
          onClick={() => navigate('/directions')}
        >
          Показать больше направлений
        </Button>
      </Box>
    </Box>
  );
};

export default DirectionsMosaic; 