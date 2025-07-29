import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, Collapse } from '@mui/material';

interface InternationalExperienceItem {
  id: number;
  title: string;
  details?: string;
  order?: number;
}

const InternationalExperience: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [experiences, setExperiences] = useState<InternationalExperienceItem[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/international-experience');
        const data = await response.json();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching international experience:', error);
      }
    };

    fetchExperiences();
  }, []);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontWeight: 900,
          fontSize: { xs: 32, md: 48 },
          mb: { xs: 4, md: 6 },
          textAlign: 'left',
          pl: { xs: 2, md: 6 },
          color: 'primary.main',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}
      >
        <Box component="span" sx={{ color: 'primary.main' }}>Международный</Box>{' '}
        <Box component="span" sx={{ color: '#111' }}>опыт</Box>
      </Typography>
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 2, sm: 4, md: 8 }, // увеличенные боковые отступы
          maxWidth: '98vw',
          width: '100%',
          borderRadius: { xs: '24px', md: '40px' },
          backgroundImage: 'url(/image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#1A59DE', // fallback
          boxShadow: '0 8px 48px 0 rgba(26,89,222,0.10)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          margin: '0 auto',
        }}
      >
        {experiences.map((item: InternationalExperienceItem, idx: number) => (
          <Box key={item.id}>
            <Box
              onClick={() => item.details && handleToggle(item.id)}
              sx={{
                fontSize: { xs: 17, md: 20 },
                fontWeight: 500,
                py: { xs: 1.5, md: 2.2 },
                px: { xs: 2, md: 6 },
                color: '#fff',
                lineHeight: 1.35,
                cursor: item.details ? 'pointer' : 'default',
                transition: 'background 0.2s',
                borderRadius: 3,
                '&:hover': item.details ? { background: 'rgba(255,255,255,0.07)' } : {},
              }}
            >
              {item.title}
            </Box>
            <Collapse in={openId === item.id} timeout="auto" unmountOnExit>
              <Box sx={{ px: { xs: 2, md: 6 }, pb: 2 }}>
                <Typography sx={{ color: '#fff', opacity: 0.92, fontSize: { xs: 15, md: 17 } }}>{item.details}</Typography>
              </Box>
            </Collapse>
            {idx < experiences.length - 1 && (
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.25)' }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default InternationalExperience; 