import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, InputAdornment } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/requests';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name) return 'Пожалуйста, введите имя.';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Некорректный email.';
    if (phone && !/^\+?\d{10,15}$/.test(phone.replace(/\D/g, ''))) return 'Некорректный телефон.';
    if (!message) return 'Введите сообщение.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      await axios.post(API_URL, {
        name,
        email,
        message,
        // phone, // если нужно сохранять телефон
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      setError('Ошибка при отправке. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      id="contact-form"
      sx={{
        maxWidth: 1100,
        mx: 'auto',
        mt: 0,
        mb: { xs: 6, md: 10 },
        borderRadius: { xs: '24px', md: '40px' },
        background: '#fff',
        boxShadow: '0 8px 48px 0 rgba(26,89,222,0.10)',
        px: { xs: 3, md: 8 },
        py: { xs: 4, md: 7 },
        position: 'relative',
        zIndex: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 900,
          fontSize: { xs: 26, md: 36 },
          color: 'primary.main',
          mb: 3,
          letterSpacing: '-0.01em',
        }}
      >
        Связаться с нами
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Имя"
          value={name}
          onChange={e => setName(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          variant="outlined"
          type="email"
          fullWidth
          sx={{ mb: 0 }}
        />
        <TextField
          label="Сообщение"
          value={message}
          onChange={e => setMessage(e.target.value)}
          variant="outlined"
          multiline
          minRows={4}
          fullWidth
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Спасибо! Ваше сообщение отправлено.</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: 999, fontWeight: 700, fontSize: 18, px: 5, mt: 2, boxShadow: '0 4px 24px rgba(26,89,222,0.10)' }}
          disabled={loading}
        >
          {loading ? 'Отправка...' : 'Отправить'}
        </Button>
      </Box>
    </Box>
  );
};

export default ContactForm; 