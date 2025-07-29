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
  TextField,
  InputAdornment,
  Alert,
  Chip,
  Link as MuiLink,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_URL = 'http://localhost:3001/api/vacancies';

interface Vacancy {
  id: number;
  title: string;
  description: string;
  requirements: string;
  category?: { id: number; name: string };
  // Новые опциональные поля
  salary?: string;
  location?: string;
  workFormat?: string;
  schedule?: string;
  publishedAt?: string;
  hrContact?: string;
  bonuses?: string;
  selectionStages?: string;
  stack?: string;
  experience?: string;
  education?: string;
  links?: string;
  pdf?: string;
}

const VacancyDetailPage: React.FC = () => {
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const [allVacancies, setAllVacancies] = useState<Vacancy[]>([]);
  const [responseForm, setResponseForm] = useState({ name: '', email: '', message: '' });
  const [responseSuccess, setResponseSuccess] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Vacancy>(`${API_URL}/${id}`);
        setVacancy(response.data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить информацию о вакансии.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancy();
  }, [id]);

  useEffect(() => {
    axios.get(API_URL).then(res => setAllVacancies(res.data));
  }, []);

  const handleResponseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResponseForm({ ...responseForm, [e.target.name]: e.target.value });
  };

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseError(null);
    try {
      await axios.post(`${API_URL}/${id}/responses`, responseForm);
      setResponseSuccess(true);
      setResponseForm({ name: '', email: '', message: '' });
    } catch (err) {
      setResponseError('Ошибка при отправке отклика.');
    }
  };

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

  if (!vacancy) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, maxWidth: 1100, mx: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/vacancies" sx={{ mb: 2 }}>
        Все вакансии
      </Button>
      <Paper elevation={3} sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 }, borderRadius: 4, mb: 4, boxShadow: '0 8px 48px 0 rgba(26,89,222,0.10)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 6 } }}>
          {/* Левая колонка — ключевые параметры */}
          <Box sx={{ width: { xs: '100%', md: 320 }, minWidth: 220, maxWidth: 400, alignSelf: 'flex-start', mb: { xs: 2, md: 0 } }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 2, color: 'primary.main', letterSpacing: '-1px' }}>
              {vacancy.title}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {vacancy.salary && <Chip label={vacancy.salary} color="primary" variant="filled" sx={{ fontSize: 18, fontWeight: 700, px: 2, py: 1 }} />}
              {vacancy.location && <Chip label={vacancy.location} color="secondary" variant="outlined" />}
              {vacancy.workFormat && <Chip label={vacancy.workFormat} variant="outlined" />}
              {vacancy.schedule && <Chip label={vacancy.schedule} variant="outlined" />}
              {vacancy.category && <Chip label={vacancy.category.name} color="default" variant="outlined" />}
            </Box>
            {vacancy.pdf && (
              <MuiLink href={vacancy.pdf} target="_blank" rel="noopener noreferrer" underline="none">
                <Button variant="contained" color="primary" sx={{ borderRadius: 999, fontWeight: 700, mt: 1 }}>
                  Скачать PDF
                </Button>
              </MuiLink>
            )}
            {vacancy.publishedAt && (
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Опубликовано: {new Date(vacancy.publishedAt).toLocaleDateString()}
              </Typography>
            )}
            {vacancy.hrContact && (
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Контакт HR: <MuiLink href={`mailto:${vacancy.hrContact}`}>{vacancy.hrContact}</MuiLink>
              </Typography>
            )}
          </Box>
          {/* Правая колонка — описание и детали */}
          <Box sx={{ flex: 2, minWidth: 0, pl: { md: 4 } }}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 2 }}>{vacancy.description}</Typography>
            {vacancy.stack && <Chip label={vacancy.stack} color="primary" variant="outlined" sx={{ mb: 2 }} />}
            {vacancy.requirements && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Требования:</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{vacancy.requirements}</Typography>
              </Box>
            )}
            {vacancy.bonuses && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Бонусы:</Typography>
                <Typography variant="body1">{vacancy.bonuses}</Typography>
              </Box>
            )}
            {vacancy.selectionStages && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Этапы отбора:</Typography>
                <Typography variant="body1">{vacancy.selectionStages}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              {vacancy.experience && <Chip label={`Опыт: ${vacancy.experience}`} variant="outlined" />}
              {vacancy.education && <Chip label={`Образование: ${vacancy.education}`} variant="outlined" />}
            </Box>
            {vacancy.links && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Ссылки:</Typography>
                {(() => {
                  try {
                    const arr = JSON.parse(vacancy.links);
                    if (Array.isArray(arr)) {
                      return arr.map((l, i) => (
                        <MuiLink key={i} href={l} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-block', mr: 2, mb: 1 }}>
                          <Chip label={l} clickable color="primary" variant="outlined" />
                        </MuiLink>
                      ));
                    }
                  } catch {}
                  return <MuiLink href={vacancy.links} target="_blank" rel="noopener noreferrer">{vacancy.links}</MuiLink>;
                })()}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
      {/* Другие вакансии */}
      <Box sx={{ mt: 6, maxWidth: 900, mx: 'auto', display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
            Другие вакансии
          </Typography>
        </Box>
        {allVacancies.filter(v => v.id !== vacancy.id).slice(0, 3).map(v => (
          <Paper
            key={v.id}
            elevation={2}
            sx={{ width: 260, p: 2, borderRadius: 3, cursor: 'pointer', textDecoration: 'none', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 8px 32px rgba(45,91,255,0.12)', background: '#f5faff' } }}
            component={RouterLink}
            to={`/vacancies/${v.id}`}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{v.title}</Typography>
          </Paper>
        ))}
      </Box>
      {/* Форма отклика */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
          Откликнуться на вакансию
        </Typography>
        <Box
          sx={{
            background: '#fff',
            boxShadow: '0 8px 48px 0 rgba(26,89,222,0.10)',
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            maxWidth: 480,
            mx: 'auto',
          }}
        >
          <form onSubmit={handleResponseSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField label="Имя" name="name" value={responseForm.name} onChange={handleResponseChange} required fullWidth size="medium" />
              <TextField label="Email" name="email" value={responseForm.email} onChange={handleResponseChange} required type="email" fullWidth size="medium" />
              <TextField label="Сообщение" name="message" value={responseForm.message} onChange={handleResponseChange} required multiline rows={4} fullWidth size="medium" />
              {responseSuccess && <Alert severity="success">Отклик успешно отправлен!</Alert>}
              {responseError && <Alert severity="error">{responseError}</Alert>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ borderRadius: 999, fontWeight: 700, fontSize: 18, px: 5, mt: 1, boxShadow: '0 4px 24px rgba(26,89,222,0.10)' }}
                disabled={loading}
              >
                {loading ? 'Отправка...' : 'Отправить отклик'}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default VacancyDetailPage; 