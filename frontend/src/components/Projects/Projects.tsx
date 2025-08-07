import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
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
  createdAt?: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    axios.get(API_URL).then(res => setProjects(res.data));
  }, []);

  const sortedProjects = [...projects].sort((a, b) => (b.createdAt && a.createdAt ? b.createdAt.localeCompare(a.createdAt) : 0));

  return (
    <Box sx={{
      position: 'relative',
      overflow: 'hidden',
      py: { xs: 4, md: 8 },
      px: { xs: 2, md: 0 },
      backgroundImage: `linear-gradient(120deg, #2D5BFF 0%, #E5E8F0 60%, #fff 100%)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      {/* Noise-эффект */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/noise.png")',
          opacity: 0.13,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 700, 
            mb: { xs: 3, md: 4 }, 
            textAlign: 'center', 
            fontFamily: 'Inter, Montserrat, Roboto, Arial, sans-serif',
            fontSize: { xs: '1.75rem', md: '2.5rem' },
            px: { xs: 2, md: 0 }
          }}
        >
          Наши проекты
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={{ xs: 2, md: 4 }} justifyContent="center">
          {sortedProjects.map((project) => (
            <Paper
              key={project.id}
              elevation={3}
              sx={{
                width: { xs: '100%', sm: 300, md: 340 },
                borderRadius: 4,
                p: { xs: 2, md: 3 },
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 8px 32px rgba(45,91,255,0.12)' },
                fontFamily: 'Inter, Montserrat, Roboto, Arial, sans-serif',
              }}
            >
              {project.image && (
                <img 
                  src={project.image.startsWith('http') ? project.image : `/api${project.image}`} 
                  alt={project.title} 
                  style={{ width: '100%', borderRadius: 12, marginBottom: 16 }} 
                />
              )}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{project.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{project.description}</Typography>
              {project.createdAt && (
                <Typography variant="caption" sx={{ color: 'grey.600', mb: 1, fontStyle: 'italic' }}>
                  {new Date(project.createdAt).toLocaleDateString()}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: 8, mt: 'auto', px: 4, py: 1.5, fontWeight: 600, textTransform: 'none', fontFamily: 'inherit' }}
                component={Link}
                to={`/projects/${project.id}`}
              >
                Подробнее
              </Button>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Projects; 