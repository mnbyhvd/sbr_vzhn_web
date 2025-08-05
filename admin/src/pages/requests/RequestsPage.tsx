import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, TableContainer, CircularProgress, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { safeApiCall, getDataWithFallback } from '../../utils/api';

interface RequestItem {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    console.log('🔄 Fetching requests...');
    console.log('🔄 Fetching requests...');
    setLoading(true);
    setError(null);
    try {
      const data = await getDataWithFallback('/api/requests');
      console.log('✅ Requests loaded:', data);
      console.log('✅ Requests loaded:', data);
      setRequests(data);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error('❌ Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const result = await safeApiCall(`/api/requests/${id}`, {
        method: 'DELETE',
      });
      if (result !== null) {
        fetchRequests();
      } else {
        setError('Ошибка удаления');
      }
    } catch (err) {
      setError('Ошибка удаления');
      console.error('Error deleting request:', err);
    }
  };

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, py: 3 }}>
      <Box display="flex" flexDirection="column" sx={{ height: '100%' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Заявки с сайта</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ flexGrow: 1, minHeight: 0, width: '100%', overflow: 'auto' }}>
              <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Сообщение</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Нет заявок</TableCell>
              </TableRow>
            ) : (
              requests.slice().reverse().map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{r.message}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Удалить">
                      <IconButton onClick={() => handleDelete(r.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RequestsPage; 