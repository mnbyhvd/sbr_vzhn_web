import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Button, TextField, Chip, Avatar } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/projects';

interface Direction {
  id: number;
  title: string;
}
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
interface ProjectWithDirections extends Project {
  directions?: Direction[];
}

const ProjectsListPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectWithDirections[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [filterDirections, setFilterDirections] = useState<Direction[]>([]);
  const [filterClient, setFilterClient] = useState('');
  const [search, setSearch] = useState('');
  const location = useLocation();

  // Получаем directionId из query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dirId = params.getAll('directionId');
    if (dirId.length && directions.length) {
      setFilterDirections(directions.filter(d => dirId.includes(String(d.id))));
    }
    // eslint-disable-next-line
  }, [location.search, directions]);

  // Загрузка направлений
  useEffect(() => {
    axios.get('http://localhost:3001/api/directions').then(res => setDirections(res.data));
  }, []);

  // Загрузка проектов с фильтрами
  useEffect(() => {
    const params = new URLSearchParams();
    if (filterDirections.length > 0) {
      filterDirections.forEach(d => params.append('directionId', String(d.id)));
    }
    if (filterClient) params.append('client', filterClient);
    if (search) params.append('search', search);
    axios.get(API_URL + '?' + params.toString()).then(res => setProjects(res.data));
  }, [filterDirections, filterClient, search]);

  return (
    <Box sx={{ py: 8, background: '#fff' }}>
      <Container>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, mt: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            Все проекты
          </Typography>
          <Button component={Link} to="/" variant="outlined" sx={{ borderRadius: 999, px: 3 }}>
            На главную
          </Button>
        </Box>
        {/* Фильтры */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Autocomplete
            multiple
            options={directions}
            getOptionLabel={option => option.title}
            value={filterDirections}
            onChange={(_, v) => setFilterDirections(v)}
            renderInput={params => <TextField {...params} label="Фильтр по направлениям" size="small" />}
            sx={{ flex: 1, minWidth: 180, maxWidth: 400 }}
          />
          <TextField
            label="Фильтр по клиенту"
            value={filterClient}
            onChange={e => setFilterClient(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 180, maxWidth: 400 }}
          />
          <TextField
            placeholder="Поиск по всем полям..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 180, maxWidth: 400 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {projects.map((project) => (
            <Paper
              key={project.id}
              component={Link}
              to={`/projects/${project.id}`}
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(45,91,255,0.06)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'box-shadow 0.18s, transform 0.18s',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 4px 24px rgba(45,91,255,0.13)',
                  transform: 'translateY(-2px) scale(1.01)',
                },
              }}
            >
              {/* Логотип клиента */}
              {project.image ? (
                <Box sx={{ height: 56, display: 'flex', alignItems: 'center', mr: 2, flexShrink: 0 }}>
                  <img
                    src={project.image.startsWith('http') ? project.image : `http://localhost:3001${project.image}`}
                    alt={project.client}
                    style={{ height: 56, width: 'auto', marginRight: 0, display: 'block', maxWidth: 160 }}
                  />
                </Box>
              ) : (
                <Avatar sx={{ width: 56, height: 56, mr: 2, flexShrink: 0, bgcolor: '#e0e0e0', color: '#222', fontWeight: 700 }} variant="rounded">
                  {project.client?.charAt(0).toUpperCase() || '?'}
                </Avatar>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{project.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>{project.description}</Typography>
                {project.directions && project.directions.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {project.directions.map(dir => (
                      <Chip key={dir.id} label={dir.title} size="small" color="primary" />
                    ))}
                  </Box>
                )}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', color: 'text.secondary', fontSize: 15 }}>
                  <span>Клиент: <b>{project.client}</b></span>
                  <span>Отрасль: <b>{project.industry}</b></span>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectsListPage; 