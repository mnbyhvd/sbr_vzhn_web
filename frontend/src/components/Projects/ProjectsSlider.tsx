import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import axios from 'axios';

const API_URL = '/api/projects';

interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  client: string;
  industry: string;
  technologies: string;
  details: string;
  bgColor: string;
  textColor: string;
  order?: number;
  createdAt: string;
}

const AUTO_SLIDE_INTERVAL = 4000;

const ProjectsSlider: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const total = projects.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    axios.get(API_URL).then(res => setProjects(res.data));
  }, []);

  // Карточки для анимации: позиции и стили
  const getCardStyle = (pos: number) => {
    // pos: -1 (слева), 0 (центр), 1 (справа)
    const isCenter = pos === 0;
    const base = {
      position: 'absolute' as const,
      top: 0,
      left: '50%',
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', // Более плавная анимация
      borderRadius: '44px',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'space-between',
      userSelect: 'none' as const,
      pointerEvents: isCenter ? 'auto' : 'auto',
      boxShadow:
        isCenter
          ? '0 14px 56px 0 rgba(26,89,222,0.18)'
          : '0 12px 48px 0 rgba(26,89,222,0.18)',
      opacity: isCenter ? 1 : 0.7, // Уменьшил прозрачность для неактивных карточек
      zIndex: isCenter ? 3 : 2 - Math.abs(pos),
      cursor: isCenter ? 'default' : 'pointer',
    };
    return {
      ...base,
      width: {
        xs: 'min(360px, calc(100vw - 32px))',
        sm: 370,
        md: isCenter ? 600 : 400,
        lg: isCenter ? 720 : 480,
      },
      minHeight: { xs: 340, md: isCenter ? 440 : 320 },
      maxWidth: { xs: 'calc(100vw - 32px)', md: isCenter ? 720 : 480 },
      maxHeight: { xs: 460, md: isCenter ? 540 : 380 },
      p: { xs: 2, md: 4 },
      transform: {
        xs:
          isCenter
            ? 'translateX(-50%) scale(1)'
            : `translateX(-50%) translateX(${pos * 62}%) translateY(8px) scale(0.98)`,
        md:
          isCenter
            ? 'translateX(-50%) scale(1.09)'
            : `translateX(-50%) translateX(${pos * 72}%) translateY(21px) scale(1.01)`,
      },
    };
  };

  // Для анимации: вычисляем позиции -1, 0, 1 относительно текущего индекса
  const getAnimatedIndices = () => {
    if (total < 3) {
      // Если проектов мало, просто возвращаем индексы существующих
      return Array.from({ length: total }, (_, i) => i);
    }
    const prev = (index - 1 + total) % total;
    const curr = index;
    const next = (index + 1) % total;
    return [prev, curr, next];
  };

  const animatedIndices = getAnimatedIndices();

  // Автослайд
  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setTimeout(() => setIndex((prev) => (prev + 1) % total), AUTO_SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, isHovered, total]);

  // Клик по боковой карточке
  const handleCardClick = (pos: number) => {
    if (pos === -1) setIndex((prev) => (prev - 1 + total) % total);
    if (pos === 1) setIndex((prev) => (prev + 1) % total);
  };

  // Touch/swipe для мобильных
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) setIndex((prev) => (prev - 1 + total) % total);
    if (delta < -50) setIndex((prev) => (prev + 1) % total);
    touchStartX.current = null;
  };

  // Wheel для десктопа (горизонтальный скролл)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault(); // Предотвращаем вертикальный скролл
    if (Math.abs(e.deltaX) > 20) {
      if (e.deltaX > 0) {
        setIndex((prev) => (prev + 1) % total);
      } else {
        setIndex((prev) => (prev - 1 + total) % total);
      }
    }
  };

  return (
    <Box sx={{ py: 4, background: 'transparent', position: 'relative' }}>
      <Box sx={{ mb: 7, textAlign: 'left', pl: { xs: 2, md: 6 } }}>
        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: 32, md: 48 } }}>
          Наши проекты
        </Typography>
      </Box>
      {projects.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'grey.500' }}>Нет проектов для отображения</Box>
      ) : (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          minHeight: { xs: 480, md: 700, lg: 500 },
          px: { xs: 2, md: 0 },
          overflow: 'hidden',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <Box sx={{ width: { xs: '100%', sm: '100%', md: 1100, lg: 1400 }, maxWidth: '100%', height: { xs: 480, md: 700, lg: 500 }, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {animatedIndices.map((idx, i) => {
            // pos: -1 (левый), 0 (центр), 1 (правый)
            const pos = total < 3 ? 0 : i - 1;
            const project = projects[idx];
            return (
              <Box key={project.id} sx={getCardStyle(pos)} onClick={() => handleCardClick(pos)}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: { xs: 120, md: 180 },
                      background: project.bgColor,
                      mb: 3.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: project.textColor,
                      fontWeight: 900,
                      fontSize: pos === 0 ? 38 : 24,
                      boxShadow: 'none',
                      overflow: 'hidden',
                    }}
                  >
                    {project.image ? (
                      <img
                        src={project.image.startsWith('http') ? project.image : `/api${project.image}`}
                        alt={project.title}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                      />
                    ) : (
                      <span style={{ width: '100%', textAlign: 'center' }}>LOGO</span>
                    )}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, fontSize: pos === 0 ? 26 : 18, color: 'primary.main', textAlign: 'center' }}>{project.title}</Typography>
                  <Typography variant="body1" sx={{ color: '#0D2C75', fontWeight: 500, fontSize: { xs: 16, md: 18 }, mb: 2, textAlign: 'center', maxWidth: 400 }}>{project.description}</Typography>
                </Box>
                {pos === 0 && (
                <Button
                    variant="contained"
                  color="primary"
                  size="large"
                    sx={{ mt: 2, borderRadius: 999, fontWeight: 700, fontSize: 16, px: 4, width: '100%' }}
                >
                  Подробнее
                </Button>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
      )}
    </Box>
  );
};

export default ProjectsSlider; 