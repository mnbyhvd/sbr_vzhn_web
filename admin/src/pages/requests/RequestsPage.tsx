import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, TableContainer, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const fetchRequests = () => {
    setLoading(true);
    axios.get('/api/requests')
      .then(res => setRequests(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id: number) => {
          await axios.delete(`/api/requests/${id}`);
    fetchRequests();
  };

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, py: 3 }}>
      <Box display="flex" flexDirection="column" sx={{ height: '100%' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Заявки с сайта</Typography>
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