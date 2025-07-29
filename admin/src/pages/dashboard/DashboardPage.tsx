import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Card, CardContent, Divider, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  client: string;
  industry: string;
  technologies: string;
  details: string;
  createdAt: string;
}
interface Vacancy {
  id: number;
  title: string;
  description: string;
  requirements: string;
  createdAt: string;
}
interface Partner {
  id: number;
  name: string;
  logo: string;
}
interface RequestItem {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function getRandomStats(start: string, end: string) {
  // Генерируем случайные данные для выбранного периода
  const days = dayjs(end).diff(dayjs(start), 'day') + 1;
  const week = Array.from({ length: days }, (_, i) => ({
    day: dayjs(start).add(i, 'day').format('DD.MM'),
    visits: Math.floor(100 + Math.random() * 200),
  }));
  return {
    visits: week.reduce((a, b) => a + b.visits, 0),
    pageviews: week.reduce((a, b) => a + b.visits * (1.5 + Math.random()), 0),
    users: Math.floor(week.reduce((a, b) => a + b.visits, 0) * 0.7),
    bounceRate: Math.floor(30 + Math.random() * 20),
    week,
  };
}

const defaultStart = dayjs().subtract(6, 'day').format('YYYY-MM-DD');
const defaultEnd = dayjs().format('YYYY-MM-DD');

const DashboardPage: React.FC = () => {
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [stats, setStats] = useState(() => getRandomStats(defaultStart, defaultEnd));

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') setStartDate(value);
    else setEndDate(value);
  };

  const handleApply = () => {
    setStats(getRandomStats(startDate, endDate));
  };

  const handleExport = () => {
    const csvRows = [
      'День,Визиты',
      ...stats.week.map(d => `${d.day},${d.visits}`),
      '',
      `Всего визитов,${stats.visits}`,
      `Просмотры,${Math.round(stats.pageviews)}`,
      `Пользователи,${stats.users}`,
      `Отказы,${stats.bounceRate}%`,
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stat-${startDate}_to_${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Мок: заявки = 3-7% от визитов
  const leads = Math.round(stats.visits * (0.03 + Math.random() * 0.04));
  const conversion = stats.visits > 0 ? ((leads / stats.visits) * 100).toFixed(1) : '0';

  // Для графика: линия конверсии
  const chartData = {
    labels: stats.week.map((d) => d.day),
    datasets: [
      {
        label: 'Визиты',
        data: stats.week.map((d) => d.visits),
        fill: false,
        borderColor: '#1976d2',
        backgroundColor: '#1976d2',
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Конверсия (%)',
        data: stats.week.map((d) => {
          const dayLeads = Math.round(d.visits * (0.03 + Math.random() * 0.04));
          return d.visits > 0 ? parseFloat((dayLeads / d.visits) * 100) : 0;
        }),
        fill: false,
        borderColor: '#43a047',
        backgroundColor: '#43a047',
        borderDash: [5, 5],
        tension: 0.3,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Визиты' } },
      y1: {
        beginAtZero: true,
        position: 'right' as const,
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Конверсия (%)' },
      },
    },
  };

  return (
    <Box sx={{ py: 6, px: { xs: 1, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>Дашборд</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <TextField
          label="Начало периода"
          type="date"
          size="small"
          value={startDate}
          onChange={e => handleDateChange('start', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Конец периода"
          type="date"
          size="small"
          value={endDate}
          onChange={e => handleDateChange('end', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleApply}>Показать</Button>
        <Button variant="outlined" onClick={handleExport}>Выгрузить в CSV</Button>
      </Stack>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Визиты</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.visits}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Просмотры</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{Math.round(stats.pageviews)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Пользователи</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.users}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Отказы</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{stats.bounceRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 2.4 }}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Заявки</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{leads}</Typography>
              <Typography color="text.secondary" sx={{ fontSize: 14 }}>Конверсия: {conversion}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 2, mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Визиты и конверсия по дням</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 340 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage; 