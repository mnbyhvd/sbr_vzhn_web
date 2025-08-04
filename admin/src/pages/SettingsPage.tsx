import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Button, Snackbar, Alert, Paper, InputAdornment, IconButton, Avatar } from '@mui/material';
import axios from 'axios';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const API_URL = '/api/site-settings';

const tabLabels = ['Цвета', 'Тексты', 'Контакты', 'Соцсети', 'QR', 'Прочее'];

const defaultSettings = {
  colors: { primary: '', secondary: '', background: '', text: '', footerBg: '', footerText: '' },
  texts: { siteName: '', slogan: '', footer: '', copyright: '' },
  contacts: { email: '', phone: '', address: '' },
  socials: { vk: '', telegram: '', whatsapp: '', youtube: '', facebook: '', instagram: '' },
  qr: { image: '', link: '' },
  misc: { presentation: '', banner: '' }
};

// Безопасно приводит значение к строке
const getStringValue = (value: any) => (typeof value === 'string' ? value : '');

// Маппинг ключей на читаемые лейблы
const LABELS: Record<string, string> = {
  siteName: 'Название сайта',
  slogan: 'Слоган',
  footer: 'Текст в футере',
  copyright: 'Копирайт',
  email: 'E-mail',
  phone: 'Телефон',
  address: 'Адрес',
  vk: 'ВКонтакте',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  youtube: 'YouTube',
  facebook: 'Facebook',
  instagram: 'Instagram',
};

// Валидация email
const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
// Валидация телефона (простой вариант)
const validatePhone = (phone: string) => /^\+?\d{10,15}$/.test(phone.replace(/\D/g, ''));
// Валидация URL
const validateUrl = (url: string) => !url || /^https?:\/\//.test(url);

const SettingsPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [settings, setSettings] = useState<any>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setSettings(res.data);
    } catch {
      setSnackbar({open: true, message: 'Ошибка загрузки настроек', severity: 'error'});
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section: string, field: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(API_URL, settings);
      setSnackbar({open: true, message: 'Настройки сохранены', severity: 'success'});
    } catch {
      setSnackbar({open: true, message: 'Ошибка сохранения', severity: 'error'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 6, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Настройки сайта</Typography>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          {tabLabels.map((label, i) => <Tab key={i} label={label} />)}
        </Tabs>
      </Paper>
      <Box sx={{ p: 3, background: '#fff', borderRadius: 3, boxShadow: 1 }}>
        {tab === 0 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Цвета сайта</Typography>
            {Object.entries(settings.colors).map(([key, value]) => (
              <TextField key={key} label={key} type="color" value={value} onChange={e => handleChange('colors', key, e.target.value)} sx={{ width: 180 }} InputLabelProps={{ shrink: true }} />
            ))}
          </Box>
        )}
        {tab === 1 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Тексты</Typography>
            {['siteName', 'slogan', 'footer', 'copyright'].map((key) => (
              <TextField
                key={key}
                label={LABELS[key] || key}
                value={typeof settings.texts[key] === 'string' ? settings.texts[key] : ''}
                onChange={e => handleChange('texts', key, e.target.value)}
                fullWidth
              />
            ))}
            {/* Превью футера */}
            <Box sx={{ mt: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f9f9f9' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Превью футера:</Typography>
              <Box sx={{ color: '#222', fontSize: 15, mb: 1 }}>{settings.texts.copyright || '© 2024 Название компании'}</Box>
              <Box sx={{ color: '#555', fontSize: 14, mb: 1 }}>
                {settings.contacts.email && <span>Email: {settings.contacts.email} </span>}
                {settings.contacts.phone && <span>Тел: {settings.contacts.phone} </span>}
                {settings.contacts.address && <span>Адрес: {settings.contacts.address}</span>}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                {['vk', 'telegram', 'whatsapp', 'youtube', 'facebook', 'instagram'].map((key) => (
                  settings.socials[key] ? (
                    <a key={key} href={settings.socials[key]} target="_blank" rel="noopener noreferrer" style={{ color: '#1A59DE', textDecoration: 'none', fontSize: 18 }}>
                      {LABELS[key]}
                    </a>
                  ) : null
                ))}
              </Box>
            </Box>
          </Box>
        )}
        {tab === 2 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Контакты</Typography>
            {['email', 'phone', 'address'].map((key) => {
              const value = typeof settings.contacts[key] === 'string' ? settings.contacts[key] : '';
              let error = false;
              let helperText = '';
              if (key === 'email' && value && !validateEmail(value)) {
                error = true;
                helperText = 'Некорректный email';
              }
              if (key === 'phone' && value && !validatePhone(value)) {
                error = true;
                helperText = 'Некорректный телефон';
              }
              return (
                <TextField
                  key={key}
                  label={LABELS[key] || key}
                  value={value}
                  onChange={e => handleChange('contacts', key, e.target.value)}
                  fullWidth
                  error={error}
                  helperText={helperText}
                />
              );
            })}
          </Box>
        )}
        {tab === 3 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Соцсети</Typography>
            {['vk', 'telegram', 'whatsapp', 'youtube', 'facebook', 'instagram'].map((key) => {
              const value = getStringValue(settings.socials[key]);
              let error = false;
              let helperText = '';
              if (value && !validateUrl(value)) {
                error = true;
                helperText = 'Некорректная ссылка (должна начинаться с http:// или https://)';
              }
              return (
                <TextField
                  key={key}
                  label={LABELS[key] || key}
                  value={value}
                  onChange={e => handleChange('socials', key, e.target.value)}
                  fullWidth
                  error={error}
                  helperText={helperText}
                  InputProps={{
                    endAdornment: value ? (
                      <InputAdornment position="end">
                        <IconButton onClick={() => navigator.clipboard.writeText(value)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }}
                />
              );
            })}
          </Box>
        )}
        {tab === 4 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">QR-код</Typography>
            <TextField label="Ссылка" value={typeof settings.qr.link === 'string' ? settings.qr.link : ''} onChange={e => handleChange('qr', 'link', e.target.value)} fullWidth />
            <TextField label="URL изображения QR" value={typeof settings.qr.image === 'string' ? settings.qr.image : ''} onChange={e => handleChange('qr', 'image', e.target.value)} fullWidth />
            {typeof settings.qr.image === 'string' && settings.qr.image.trim() !== '' ? (
              <Avatar src={settings.qr.image} alt="QR" sx={{ width: 120, height: 120, mt: 2 }} />
            ) : null}
          </Box>
        )}
        {tab === 5 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Прочее</Typography>
            {Object.entries(settings.misc).map(([key, value]) => (
              <TextField key={key} label={key} value={typeof value === 'string' ? value : ''} onChange={e => handleChange('misc', key, e.target.value)} fullWidth />
            ))}
          </Box>
        )}
        <Button variant="contained" color="primary" sx={{ mt: 4, borderRadius: 2, fontWeight: 600 }} onClick={handleSave} disabled={loading}>Сохранить</Button>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage; 