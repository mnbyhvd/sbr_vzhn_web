import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Link as MuiLink,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  // Новые опциональные поля
  startDate?: string;
  endDate?: string;
  team?: string;
  links?: string;
  status?: string;
  curator?: string;
  budget?: string;
  tools?: string;
  feedback?: string;
  presentation?: string;
}

const ProjectDetailPage: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Project>(`${API_URL}/${id}`);
        setProject(response.data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить информацию о проекте.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    axios.get(API_URL).then(res => setAllProjects(res.data));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5" color="error" align="center">{error}</Typography>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ pt: { xs: 8, md: 10 }, pb: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 } }}>
      <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/projects" sx={{ mb: { xs: 1, md: 2 } }}>
        Все проекты
      </Button>
      <Paper elevation={3} sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 }, borderRadius: 1, mb: { xs: 3, md: 4 }, boxShadow: '0 8px 48px 0 rgba(26,89,222,0.10)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 6 } }}>
          {/* Картинка */}
          {project.image && (
            <Box sx={{ 
              width: { xs: '100%', md: 360 }, 
              minWidth: { xs: '100%', md: 220 }, 
              maxWidth: { xs: '100%', md: 400 }, 
              alignSelf: 'flex-start', 
              mb: { xs: 2, md: 0 },
              display: 'flex',
              justifyContent: 'center'
            }}>
              <img
                src={project.image.startsWith('http') ? project.image : `/api${project.image}`}
                alt={project.title}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  maxWidth: '400px',
                  borderRadius: 4, 
                  boxShadow: '0 4px 24px rgba(26,89,222,0.10)',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
            </Box>
          )}
          {/* Основная информация */}
          <Box sx={{ flex: 2, minWidth: 0, pl: { md: 4 } }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 800, 
                mb: { xs: 1, md: 2 }, 
                color: 'primary.main', 
                letterSpacing: '-1px',
                fontSize: { xs: '1.75rem', md: '2.5rem' }
              }}
            >
              {project.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: { xs: 1, md: 2 }, fontSize: { xs: '1rem', md: '1.25rem' } }}>{project.description}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, md: 1 }, mb: { xs: 2, md: 3 } }}>
              {project.status && <Chip label={project.status} color="primary" variant="outlined" size="small" />}
              {project.budget && <Chip label={`Бюджет: ${project.budget}`} color="secondary" variant="outlined" size="small" />}
              {project.startDate && <Chip label={`Начало: ${new Date(project.startDate).toLocaleDateString()}`} variant="outlined" size="small" />}
              {project.endDate && <Chip label={`Окончание: ${new Date(project.endDate).toLocaleDateString()}`} variant="outlined" size="small" />}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap', gap: { xs: 1, md: 2 }, mb: { xs: 2, md: 3 } }}>
              <Typography variant="body1" sx={{ minWidth: { xs: '100%', md: 180 } }}><b>Клиент:</b> {project.client}</Typography>
              <Typography variant="body1" sx={{ minWidth: { xs: '100%', md: 180 } }}><b>Отрасль:</b> {project.industry}</Typography>
              <Typography variant="body1" sx={{ minWidth: { xs: '100%', md: 180 } }}><b>Технологии:</b> {project.technologies}</Typography>
              {project.curator && <Typography variant="body1" sx={{ minWidth: { xs: '100%', md: 180 } }}><b>Куратор:</b> {project.curator}</Typography>}
              {project.tools && <Typography variant="body1" sx={{ minWidth: { xs: '100%', md: 180 } }}><b>Инструменты:</b> {project.tools}</Typography>}
            </Box>
            {project.presentation && (
              <MuiLink href={project.presentation} target="_blank" rel="noopener noreferrer" underline="none">
                <Button variant="contained" color="primary" sx={{ borderRadius: 999, fontWeight: 700, mt: 1 }}>
                  Скачать презентацию
                </Button>
              </MuiLink>
            )}
            {project.links && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Ссылки:</Typography>
                {(() => {
                  try {
                    const arr = JSON.parse(project.links);
                    if (Array.isArray(arr)) {
                      return arr.map((l, i) => (
                        <MuiLink key={i} href={l} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-block', mr: 2, mb: 1 }}>
                          <Chip label={l} clickable color="primary" variant="outlined" />
                        </MuiLink>
                      ));
                    }
                  } catch {}
                  return <MuiLink href={project.links} target="_blank" rel="noopener noreferrer">{project.links}</MuiLink>;
                })()}
              </Box>
            )}
          </Box>
        </Box>
        {/* Детали и команда */}
        <Box sx={{ mt: { xs: 3, md: 6 }, mb: { xs: 3, md: 6 } }}>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 700, 
              mb: { xs: 1, md: 2 }, 
              color: 'primary.main',
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            О проекте
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: { xs: 1, md: 2 }, fontSize: { xs: '0.9rem', md: '1rem' } }}>{project.details}</Typography>
          {project.team && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Команда проекта:</Typography>
              {(() => {
                try {
                  const arr = JSON.parse(project.team);
                  if (Array.isArray(arr)) {
                    return arr.map((m, i) => (
                      <Chip key={i} label={m} sx={{ mr: 1, mb: 1 }} color="secondary" />
                    ));
                  }
                } catch {}
                return <Typography variant="body2">{project.team}</Typography>;
              })()}
            </Box>
          )}
          {project.feedback && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Отзыв клиента:</Typography>
              <Paper sx={{ p: 2, background: '#f7faff', borderRadius: 2, fontStyle: 'italic' }}>{project.feedback}</Paper>
            </Box>
          )}
        </Box>
      </Paper>
      {/* Другие проекты */}
      <Box sx={{ mt: { xs: 4, md: 6 }, maxWidth: 1100, mx: 'auto', display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, justifyContent: { xs: 'center', md: 'flex-start' } }}>
        <Box sx={{ width: '100%' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: { xs: 1, md: 2 }, 
              fontWeight: 700, 
              color: 'primary.main',
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            Другие проекты
          </Typography>
        </Box>
        {allProjects.filter(p => p.id !== project.id).slice(0, 3).map(p => (
                      <Paper
              key={p.id}
              elevation={2}
              sx={{ 
                width: { xs: '100%', sm: 280, md: 260 }, 
                p: { xs: 1.5, md: 2 }, 
                borderRadius: 1, 
                cursor: 'pointer', 
                textDecoration: 'none', 
                transition: 'box-shadow 0.2s', 
                '&:hover': { boxShadow: '0 8px 32px rgba(45,91,255,0.12)', background: '#f5faff' } 
              }}
              component={RouterLink}
              to={`/projects/${p.id}`}
            >
              {p.image && (
                <img
                  src={p.image.startsWith('http') ? p.image : `/api${p.image}`}
                  alt={p.title}
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    borderRadius: 2, 
                    marginBottom: 8,
                    objectFit: 'contain',
                    objectPosition: 'center'
                  }}
                />
              )}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', md: '1rem' } }}>{p.title}</Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default ProjectDetailPage; 