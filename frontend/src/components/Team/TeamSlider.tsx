import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import axios from 'axios';

const API_URL = '/api/team';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

const TeamSlider: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setTeamMembers(res.data))
      .catch(err => {
        console.error('Ошибка загрузки команды:', err);
        setTeamMembers([]);
      });
  }, []);

  const blockHeight = isMobile ? 320 : isTablet ? 400 : 480;
  const cardHeight = blockHeight - 40;
  const total = teamMembers.length;
  const activePercent = 0.4;
  const inactivePercent = total > 1 ? (1 - activePercent) / (total - 1) : 0;

  return (
    <Box
      sx={{
        width: '100%',
        mt: { xs: 8, md: 12 },
        pt: { xs: 4, md: 6 },
        pb: { xs: 8, md: 12 },
        px: 0,
        position: 'relative',
        backgroundImage: 'url(/image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#F7F9FB',
      }}
    >
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontWeight: 900,
          fontSize: { xs: 28, md: 40 },
          mb: { xs: 3, md: 4 },
          textAlign: 'left',
          pl: { xs: 2, md: 6 },
          color: '#fff',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}
      >
        Наша <Box component="span" sx={{ color: '#fff' }}>команда</Box>
      </Typography>
      {teamMembers.length === 0 ? null : (
        <Box
          ref={containerRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'flex-start' : 'center',
            width: '100%',
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 3, md: 8 },
            gap: 2,
            overflowX: 'hidden',
            py: 2,
            minHeight: cardHeight + 16,
            transition: 'height 0.5s',
          }}
        >
          {teamMembers.map((member, idx) => {
            const isActive = idx === activeIdx;
            return (
              <Box
                key={member.id}
                onClick={() => setActiveIdx(idx)}
                sx={{
                  cursor: isActive ? 'default' : 'pointer',
                  transition: 'flex-basis 0.7s cubic-bezier(0.4,0,0.2,1), box-shadow 0.5s, padding 0.5s, background 0.5s, transform 0.5s',
                  flex: `0 1 ${isActive ? activePercent * 100 : inactivePercent * 100}%`,
                  flexBasis: `${isActive ? activePercent * 100 : inactivePercent * 100}%`,
                  minWidth: isActive ? 120 : 24,
                  maxWidth: isActive ? 600 : 200,
                  height: cardHeight,
                  bgcolor: '#fff',
                  boxShadow: 3,
                  borderRadius: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  mx: isMobile ? 0 : 1,
                  p: isActive ? 3 : 0,
                }}
              >
                {isActive && (
                  <>
                    <Box sx={{ width: { xs: 120, md: 160 }, height: { xs: 120, md: 160 }, mb: 2, borderRadius: 1, overflow: 'hidden', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={member.image.startsWith('http') ? member.image : `/api${member.image}`}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: 'text.primary' }}>{member.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>{member.role}</Typography>
                  </>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default TeamSlider; 