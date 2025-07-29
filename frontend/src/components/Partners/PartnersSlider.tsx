import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/partners';

interface Partner {
  id: number;
  name: string;
  logo: string;
}

const PartnersSlider: React.FC = () => {
  const theme = useTheme();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    axios.get(API_URL).then(res => setPartners(res.data));
  }, []);

  if (partners.length === 0) {
    return <Box sx={{ textAlign: 'center', py: 8, color: 'grey.500' }}>Нет партнёров для отображения</Box>;
  }

  // Создаем бесконечный слайдер с повторениями для плавности
  // Дублируем массив достаточно раз, чтобы обеспечить бесконечную прокрутку
  const repeatedPartners = [...partners, ...partners, ...partners, ...partners, ...partners, ...partners];

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', py: 6 }}>
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 6, md: 8, lg: 10 }, // Одинаковые отступы между партнерами
            animation: 'partners-marquee 80s linear infinite',
            '@keyframes partners-marquee': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' }, // Прокручиваем на половину, чтобы создать бесконечность
            },
            width: '200%', // Ширина в два раза больше для бесконечной прокрутки
          }}
        >
          {repeatedPartners.map((partner, idx) => (
            <Box 
              key={`${partner.id}_${idx}`} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0, // Предотвращаем сжатие
              }}
            >
              <Box
                sx={{
                  height: { xs: 60, md: 80, lg: 100 }, // Фиксированная высота для всех логотипов
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#fff',
                  borderRadius: 2,
                  px: { xs: 2, md: 3 }, // Горизонтальные отступы для логотипа
                }}
              >
                <img
                  src={partner.logo.startsWith('http') ? partner.logo : `http://localhost:3001${partner.logo}`}
                  alt={partner.name}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PartnersSlider; 