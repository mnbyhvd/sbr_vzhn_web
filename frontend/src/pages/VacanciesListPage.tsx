import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Button, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/vacancies';

interface Vacancy {
  id: number;
  title: string;
  description: string;
  category?: { id: number; name: string };
  createdAt?: string;
  requirements?: string;
}

interface VacancyCategory {
  id: number;
  name: string;
}

const VacanciesListPage: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [categories, setCategories] = useState<VacancyCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [vacancyError, setVacancyError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/vacancies/categories')
      .then(res => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
          setCategoryError(null);
        } else {
          setCategories([]);
          setCategoryError('Ошибка загрузки категорий');
        }
      })
      .catch(() => {
        setCategories([]);
        setCategoryError('Ошибка загрузки категорий');
      });
  }, []);

  useEffect(() => {
    const params = selectedCategory ? { params: { categoryId: selectedCategory } } : {};
    axios.get(API_URL, params)
      .then(res => {
        if (Array.isArray(res.data)) {
          setVacancies(res.data);
          setVacancyError(null);
        } else {
          setVacancies([]);
          setVacancyError('Ошибка загрузки вакансий');
        }
      })
      .catch(() => {
        setVacancies([]);
        setVacancyError('Ошибка загрузки вакансий');
      });
  }, [selectedCategory]);

  const vacancyBgColors = ['#E3EAF6', '#A4C2E8'];

  const safeVacancies = Array.isArray(vacancies) ? vacancies : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <Box sx={{ py: 12, background: '#fff' }}>
      <Container maxWidth={false} sx={{ px: { xs: 1, sm: 4, md: 8 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Button component={Link} to="/" variant="outlined">
            На главную
          </Button>
          <Typography variant="h2" sx={{ fontWeight: 700, flex: 1, textAlign: 'center', m: 0 }}>
            Вакансии
          </Typography>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="category-label">Категория</InputLabel>
            <Select
              labelId="category-label"
              value={selectedCategory}
              label="Категория"
              onChange={e => setSelectedCategory(e.target.value as number | '')}
            >
              <MenuItem value="">Все категории</MenuItem>
              {safeCategories.map(cat => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {vacancyError && (
          <Alert severity="error" sx={{ mb: 2 }}>{vacancyError}</Alert>
        )}
        {categoryError && (
          <Alert severity="error" sx={{ mb: 2 }}>{categoryError}</Alert>
        )}
        <Box display="flex" flexDirection="column" gap={3}>
          {safeVacancies.map((vacancy, idx) => (
            <Paper
              key={vacancy.id}
              elevation={2}
              sx={{
                width: '100%',
                borderRadius: 3,
                p: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 8px 32px rgba(45,91,255,0.12)', background: '#f7faff' },
                cursor: 'pointer',
                textDecoration: 'none',
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                background: vacancyBgColors[idx % 2],
                mx: 0,
              }}
              component={Link}
              to={`/vacancies/${vacancy.id}`}
            >
              <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left', pl: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, textAlign: 'left' }}>{vacancy.title}</Typography>
                {vacancy.category?.name && (
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500, mr: 2, textAlign: 'left' }}>
                    {vacancy.category.name}
                  </Typography>
                )}
                {vacancy.createdAt && (
                  <Typography variant="caption" sx={{ color: 'grey.600', fontStyle: 'italic', mr: 2, textAlign: 'left' }}>
                    {new Date(vacancy.createdAt).toLocaleDateString()}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, mb: 0.5, textAlign: 'left' }}>{vacancy.description}</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 500, mt: 0.5, textAlign: 'left' }}>Требования:</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'left' }}>{vacancy.requirements}</Typography>
              </Box>
            </Paper>
          ))}
          {safeVacancies.length === 0 && (
            <Typography align="center" sx={{p: 4}}>
              На данный момент открытых вакансий нет.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default VacanciesListPage; 