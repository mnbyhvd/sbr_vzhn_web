import React, { useState, useEffect, useRef } from 'react';
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

const API_URL = '/api/vacancies';

interface Vacancy {
  id: number;
  title: string;
  description: string;
  requirements: string;
  category?: { id: number; name: string };
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
  const [responseForm, setResponseForm] = useState({ name: '', email: '', phone: '', github: '', message: '' });
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);

  const handleDownloadPdf = () => {
    const originalTitle = document.title;
    if (vacancy?.title) document.title = `${vacancy.title} — вакансия`;
    window.print();
    document.title = originalTitle;
  };

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Vacancy>(`${API_URL}/${id}`);
        setVacancy(response.data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить информацию о вакансии.');
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['application/pdf'].includes(file.type)) {
      setResponseError('Загрузите PDF-файл');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setResponseError('PDF не должен превышать 20MB');
      return;
    }
    setUploading(true);
    setResponseError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const resp = await axios.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResumeUrl(resp.data.url);
    } catch (e: any) {
      setResponseError(e?.response?.data?.message || 'Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseError(null);
    if (!responseForm.name || !responseForm.email || !responseForm.phone || !responseForm.message) {
      setResponseError('Заполните имя, email, телефон и сообщение');
      return;
    }
    try {
      const messageParts = [responseForm.message];
      if (responseForm.github) messageParts.push(`GitHub: ${responseForm.github}`);
      if (resumeUrl) messageParts.push(`Резюме: ${resumeUrl}`);
      await axios.post(`${API_URL}/${id}/responses`, {
        name: responseForm.name,
        email: responseForm.email,
        phone: responseForm.phone,
        message: messageParts.join('\n'),
      });
      setResponseSuccess(true);
      setResponseForm({ name: '', email: '', phone: '', github: '', message: '' });
      setResumeUrl('');
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
    <Container sx={{ pt: { xs: 8, md: 10 }, pb: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 3 } }}>
      <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/vacancies" sx={{ mb: { xs: 1, md: 2 } }}>
        Все вакансии
      </Button>
      <style>{`
        @page { size: A4; margin: 10mm; }
        @media print {
          body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          /* Глобально скрываем шапку/футер и навигацию */
          header, footer, .MuiAppBar-root, .MuiDrawer-root, nav { display: none !important; height: 0 !important; overflow: hidden !important; }
          .no-print { display: none !important; }
          .pdf-layout { display: block !important; }
        }
      `}</style>
      {/* Печатная верстка A4 */}
      <Box className="pdf-layout" sx={{ display: 'none', fontFamily: 'Inter, Arial, sans-serif', color: '#111' }}>
        <Box sx={{ borderBottom: '2px solid #1A59DE', pb: 1, mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>{vacancy.title}</Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>Опубликовано: {vacancy.publishedAt ? new Date(vacancy.publishedAt).toLocaleDateString() : new Date().toLocaleDateString()}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, fontSize: 14 }}>
          {vacancy.salary && <Typography><b>Зарплата:</b> {vacancy.salary}</Typography>}
          {vacancy.location && <Typography><b>Локация:</b> {vacancy.location}</Typography>}
          {vacancy.workFormat && <Typography><b>Формат работы:</b> {vacancy.workFormat}</Typography>}
          {vacancy.schedule && <Typography><b>График:</b> {vacancy.schedule}</Typography>}
          {vacancy.category && <Typography><b>Категория:</b> {vacancy.category.name}</Typography>}
          {vacancy.experience && <Typography><b>Опыт:</b> {vacancy.experience}</Typography>}
          {vacancy.education && <Typography><b>Образование:</b> {vacancy.education}</Typography>}
        </Box>
        {vacancy.description && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A59DE', mb: 0.5 }}>Описание</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{vacancy.description}</Typography>
          </Box>
        )}
        {vacancy.requirements && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A59DE', mb: 0.5 }}>Требования</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{vacancy.requirements}</Typography>
          </Box>
        )}
        {vacancy.bonuses && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A59DE', mb: 0.5 }}>Бонусы</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{vacancy.bonuses}</Typography>
          </Box>
        )}
        {vacancy.selectionStages && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A59DE', mb: 0.5 }}>Этапы отбора</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{vacancy.selectionStages}</Typography>
          </Box>
        )}
        {vacancy.links && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A59DE', mb: 0.5 }}>Ссылки</Typography>
            {(() => {
              try {
                const arr = JSON.parse(vacancy.links);
                if (Array.isArray(arr)) {
                  return (
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>
                      {arr.map((l: string, i: number) => (
                        <li key={i} style={{ wordBreak: 'break-all' }}>{l}</li>
                      ))}
                    </ul>
                  );
                }
              } catch {}
              return <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{vacancy.links}</Typography>;
            })()}
          </Box>
        )}
        {/* Без футера для печати */}
      </Box>
      {/* Экранная верстка (скрывается при печати) */}
      <Box className="no-print">
      <Paper elevation={3} sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 }, borderRadius: 1, mb: { xs: 3, md: 4 }, boxShadow: '0 8px 48px 0 rgba(26,89,222,0.10)' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 6 } }}>
          {/* Левая колонка — ключевые параметры */}
          <Box sx={{ width: { xs: '100%', md: 320 }, minWidth: { xs: '100%', md: 220 }, maxWidth: { xs: '100%', md: 400 }, alignSelf: 'flex-start', mb: { xs: 2, md: 0 } }}>
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
              {vacancy.title}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, md: 1 }, mb: { xs: 1, md: 2 } }}>
              {vacancy.salary && <Chip label={vacancy.salary} color="primary" variant="filled" sx={{ fontSize: { xs: 14, md: 18 }, fontWeight: 700, px: { xs: 1, md: 2 }, py: { xs: 0.5, md: 1 } }} />}
              {vacancy.location && <Chip label={vacancy.location} color="secondary" variant="outlined" size="small" />}
              {vacancy.workFormat && <Chip label={vacancy.workFormat} variant="outlined" size="small" />}
              {vacancy.schedule && <Chip label={vacancy.schedule} variant="outlined" size="small" />}
              {vacancy.category && <Chip label={vacancy.category.name} color="default" variant="outlined" size="small" />}
            </Box>
            <Button onClick={handleDownloadPdf} variant="contained" color="primary" sx={{ borderRadius: 999, fontWeight: 700, mt: 1 }} className="no-print">
              Скачать PDF
            </Button>
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
              sx={{ width: 260, p: 2, borderRadius: 1, cursor: 'pointer', textDecoration: 'none', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 8px 32px rgba(45,91,255,0.12)', background: '#f5faff' } }}
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
        <Box sx={{ background: '#fff', boxShadow: '0 8px 48px 0 rgba(26,89,222,0.10)', borderRadius: 1, p: { xs: 3, md: 4 }, maxWidth: 520, mx: 'auto' }}>
          <form onSubmit={handleResponseSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField label="Имя" name="name" value={responseForm.name} onChange={handleResponseChange} required fullWidth size="medium" />
              <TextField label="Email" name="email" value={responseForm.email} onChange={handleResponseChange} required type="email" fullWidth size="medium" />
              <TextField label="Телефон" name="phone" value={responseForm.phone} onChange={handleResponseChange} required fullWidth size="medium" />
              <TextField label="GitHub (опционально)" name="github" value={responseForm.github} onChange={handleResponseChange} fullWidth size="medium" />
              <Box>
                <Button variant="outlined" component="label" disabled={uploading} sx={{ mr: 2 }}>
                  {uploading ? 'Загрузка…' : (resumeUrl ? 'Заменить PDF' : 'Прикрепить PDF-резюме')}
                  <input hidden type="file" accept="application/pdf" onChange={handleFileSelect} />
                </Button>
                {resumeUrl && (
                  <MuiLink href={resumeUrl.startsWith('http') ? resumeUrl : `/api${resumeUrl}`} target="_blank" rel="noopener noreferrer">
                    Просмотр резюме
                  </MuiLink>
                )}
              </Box>
              <TextField label="Сообщение" name="message" value={responseForm.message} onChange={handleResponseChange} required multiline rows={4} fullWidth size="medium" />
              {responseSuccess && <Alert severity="success">Отклик успешно отправлен!</Alert>}
              {responseError && <Alert severity="error">{responseError}</Alert>}
              <Button type="submit" variant="contained" color="primary" size="large" sx={{ borderRadius: 999, fontWeight: 700, fontSize: 18, px: 5, mt: 1 }} disabled={loading || uploading}>
                {loading ? 'Отправка…' : 'Отправить отклик'}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
      </Box>
    </Container>
  );
};

export default VacancyDetailPage; 