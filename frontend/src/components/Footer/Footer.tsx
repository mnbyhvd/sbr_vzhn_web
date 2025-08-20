import React, { useEffect, useState } from 'react';
import { Box, Typography, Link, Container, Divider, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useColors } from '../../contexts/ColorContext';

// Убрали старый SVG-логотип, используем такой же блок, как в Header

const Footer: React.FC = () => {
  const theme = useTheme();
  const { colors, isHomePage } = useColors();
  const [settings, setSettings] = useState<any>({ contacts: {}, qr: {}, misc: {} });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/site-settings');
        const raw = await res.json();
        // На проде может прийти как строки JSON
        const normalize = (val: any) => {
          if (typeof val === 'string') {
            try { return JSON.parse(val); } catch { return {}; }
          }
          return val || {};
        };
        setSettings({
          contacts: normalize(raw.contacts),
          qr: normalize(raw.qr),
          misc: normalize(raw.misc),
        });
      } catch {}
    })();
  }, []);

  // Используем цвета из админки только на главной странице
  const footerBgColor = isHomePage ? colors.footerBg : theme.palette.primary.main;
  const footerTextColor = isHomePage ? colors.footerText : '#fff';

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: footerBgColor,
        color: footerTextColor,
        pt: 5,
        pb: 2,
        width: '100%',
        // убрано: position, left, right, marginLeft, marginRight
      }}
    >
      <Container sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, md: 6 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 0 } }}>
            {/* QR-код (без скруглений/рамок) */}
            {settings?.qr?.image ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <img
                  src={String(settings.qr.image).startsWith('http') ? settings.qr.image : `/api${settings.qr.image}`}
                  alt="QR"
                  style={{ width: 128, height: 128, objectFit: 'contain' }}
                />
              </Box>
            ) : null}
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={1}>
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 32,
                  maxWidth: '100%',
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                <img
                  src="/logo2.png"
                  alt="СайберВижн"
                  style={{
                    height: '100%',
                    width: 'auto',
                    maxWidth: '120px',
                    objectFit: 'contain',
                    border: 'none',
                    outline: 'none',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                sx={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.5px' }}
                component={RouterLink}
                to="/"
                style={{ textDecoration: 'none' }}
              >
                saybervizhn
              </Typography>
            </Box>
            {settings?.contacts?.address && (
              <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 500, fontSize: 18 }}>
                {settings.contacts.address}
              </Typography>
            )}
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 18, mb: 1 }}>
              {settings?.contacts?.email && (
                <>
                  <Link href={`mailto:${settings.contacts.email}`} color="inherit" underline="hover" sx={{ fontWeight: 700, fontSize: 18 }}>
                    {settings.contacts.email}
                  </Link>
                </>
              )}
              {settings?.contacts?.phone && (
                <>
                  {' '}
                  {settings?.contacts?.email ? ' | ' : ''}
                  <Link href={`tel:${settings.contacts.phone}`} color="inherit" underline="hover" sx={{ fontWeight: 700, fontSize: 18 }}>
                    {settings.contacts.phone}
                  </Link>
                </>
              )}
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
            <Box display="flex" justifyContent="center" gap={3}>
              {settings?.misc?.privacy && (
                <Link href={String(settings.misc.privacy).startsWith('http') ? settings.misc.privacy : `/api${settings.misc.privacy}`} target="_blank" rel="noopener" color="inherit" underline="hover" sx={{ fontSize: 16, fontWeight: 500 }}>
                  Политика конфиденциальности
                </Link>
              )}
              {settings?.misc?.presentation && (
                <Link href={String(settings.misc.presentation).startsWith('http') ? settings.misc.presentation : `/api${settings.misc.presentation}`} target="_blank" rel="noopener" color="inherit" underline="hover" sx={{ fontSize: 16, fontWeight: 500 }}>
                  Презентация
                </Link>
              )}
            </Box>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.7, fontSize: 15 }}>
              © {new Date().getFullYear()} Все права защищены.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 