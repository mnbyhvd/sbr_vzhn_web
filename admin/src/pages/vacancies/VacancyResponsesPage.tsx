import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, CircularProgress, Alert, Link as MuiLink, TextField } from '@mui/material';
import { getDataWithFallback } from '../../utils/api';

interface Vacancy {
  id: number;
  title: string;
  responses?: VacancyResponse[];
}

interface VacancyResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

interface FlatResponse extends VacancyResponse {
  vacancyId: number;
  vacancyTitle: string;
}

const VacancyResponsesPage: React.FC = () => {
  const [rows, setRows] = useState<FlatResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDataWithFallback('/api/vacancies');
        const vacancies: Vacancy[] = Array.isArray(data) ? data : [];
        const flat: FlatResponse[] = vacancies.flatMap(v => (v.responses || []).map(r => ({
          ...r,
          vacancyId: v.id,
          vacancyTitle: v.title,
        })));
        // Самые новые сверху
        flat.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRows(flat);
      } catch (e) {
        setError('Ошибка загрузки откликов');
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = rows.filter(r =>
    r.vacancyTitle.toLowerCase().includes(search.toLowerCase()) ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.phone.toLowerCase().includes(search.toLowerCase()) ||
    r.message.toLowerCase().includes(search.toLowerCase())
  );

  const renderWithLinks = (text: string) => {
    // простая подсветка GitHub/Резюме
    const parts = text.split(/(GitHub:\s*\S+|Резюме:\s*\S+)/gi);
    return (
      <>
        {parts.map((p, i) => {
          const m = p.match(/^(GitHub|Резюме):\s*(\S+)/i);
          if (m) {
            const url = m[2];
            return (
              <MuiLink key={i} href={url.startsWith('http') ? url : `/api${url}`} target="_blank" rel="noopener noreferrer">
                {m[1]}: {url}
              </MuiLink>
            );
          }
          return <span key={i}>{p}</span>;
        })}
      </>
    );
  };

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Отклики на вакансии</Typography>
      <TextField
        placeholder="Поиск по вакансии, имени, email, телефону, тексту…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2, maxWidth: 520 }}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper>
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Вакансия</TableCell>
                  <TableCell>Имя</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Сообщение</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center">Нет откликов</TableCell></TableRow>
                ) : filtered.map(r => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.vacancyTitle}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell><MuiLink href={`mailto:${r.email}`}>{r.email}</MuiLink></TableCell>
                    <TableCell><MuiLink href={`tel:${r.phone}`}>{r.phone}</MuiLink></TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                    <TableCell sx={{ maxWidth: 460, whiteSpace: 'pre-wrap' }}>{renderWithLinks(r.message)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default VacancyResponsesPage;
