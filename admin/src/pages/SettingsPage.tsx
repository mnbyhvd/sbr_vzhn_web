import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Button, Snackbar, Alert, Paper, InputAdornment, IconButton, Avatar, Divider } from '@mui/material';
import axios from 'axios';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import FileUpload from '../components/FileUpload';

const API_URL = '/api/site-settings';

// Упрощаем до нужного: Контакты, QR, Документы
const tabLabels = ['Контакты', 'QR', 'Документы'];

const defaultSettings = {
  contacts: { email: '', phone: '', address: '' },
  qr: { image: '', link: '' },
  misc: { presentation: '', privacy: '' }
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
  const [footerBgColor, setFooterBgColor] = useState<string>('#1A59DE');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      // Бэкенд теперь возвращает объекты; оставляем только нужные секции
      const { contacts = {}, qr = {}, misc = {}, colors = {} } = res.data || {};
      setSettings({
        contacts: contacts || defaultSettings.contacts,
        qr: qr || defaultSettings.qr,
        misc: { presentation: misc.presentation || '', privacy: misc.privacy || '' },
      });
      // Постараемся взять цвет футера из colors.footerBg (может прийти строкой JSON)
      try {
        const colorsObj = typeof colors === 'string' ? JSON.parse(colors) : (colors || {});
        if (colorsObj && typeof colorsObj.footerBg === 'string' && colorsObj.footerBg.trim()) {
          setFooterBgColor(colorsObj.footerBg);
        }
      } catch {}
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
        {tab === 1 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">QR-код</Typography>
            <TextField label="Ссылка" value={typeof settings.qr.link === 'string' ? settings.qr.link : ''} onChange={e => handleChange('qr', 'link', e.target.value)} fullWidth />
            <TextField label="URL изображения QR" value={typeof settings.qr.image === 'string' ? settings.qr.image : ''} onChange={e => handleChange('qr', 'image', e.target.value)} fullWidth />
            <Button
              variant="outlined"
              startIcon={<QrCode2Icon />}
              onClick={async () => {
                if (!settings.qr.link) return setSnackbar({ open: true, message: 'Укажите ссылку для QR', severity: 'error' });
                try {
                  // Используем публичный API для генерации PNG QR и зальем в /api/upload
                  const hex = (footerBgColor || '#1A59DE').replace('#','');
                  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(settings.qr.link)}&color=ffffff&bgcolor=${encodeURIComponent(hex)}`;
                  const resp = await fetch(qrUrl);
                  const blob = await resp.blob();
                  const file = new File([blob], 'qr.png', { type: 'image/png' });
                  const formData = new FormData();
                  formData.append('image', file);
                  const uploadResp = await axios.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
                  handleChange('qr', 'image', uploadResp.data.url || '');
                  setSnackbar({ open: true, message: 'QR сгенерирован', severity: 'success' });
                } catch (e) {
                  setSnackbar({ open: true, message: 'Не удалось сгенерировать QR', severity: 'error' });
                }
              }}
            >
              Сгенерировать QR
            </Button>
            {typeof settings.qr.image === 'string' && settings.qr.image.trim() !== '' ? (
              <img
                src={settings.qr.image.startsWith('http') ? settings.qr.image : `/api${settings.qr.image}`}
                alt="QR"
                style={{ width: 160, height: 160, marginTop: 8, objectFit: 'contain' }}
              />
            ) : null}
          </Box>
        )}
        {tab === 2 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Документы</Typography>
            <FileUpload
              label="Презентация (PDF/PPT)"
              value={typeof settings.misc.presentation === 'string' ? settings.misc.presentation : ''}
              onChange={(url) => handleChange('misc', 'presentation', url)}
            />
            <Divider />
            <FileUpload
              label="Политика конфиденциальности (PDF/DOC)"
              value={typeof settings.misc.privacy === 'string' ? settings.misc.privacy : ''}
              onChange={(url) => handleChange('misc', 'privacy', url)}
            />
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