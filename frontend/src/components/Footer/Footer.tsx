import React from 'react';
import { Box, Typography, Link, Container, Divider, useTheme } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import { Link as RouterLink } from 'react-router-dom';
import { useColors } from '../../contexts/ColorContext';

const Logo = (props: any) => (
    <SvgIcon {...props} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="2" fill="#1976d2" />
      <text x="20" y="25" textAnchor="middle" fontSize="16" fill="#fff">СВ</text>
    </SvgIcon>
  );

const Footer: React.FC = () => {
  const theme = useTheme();
  const { colors, isHomePage } = useColors();

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
            {/* QR-код */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 96, height: 96, bgcolor: '#fff', borderRadius: 4, mb: 1, boxShadow: '0 4px 24px rgba(26,89,222,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src="/qr.png" alt="QR для презентации" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
              </Box>
              <Typography variant="caption" sx={{ color: footerTextColor, opacity: 0.7, fontSize: 15 }}>QR для презентации</Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={1}>
              <Logo sx={{ fontSize: 44 }} />
              <Typography variant="h6" color="inherit" noWrap sx={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.5px' }}>
                IT Consulting
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 500, fontSize: 18 }}>
              123456, г. Москва, ул. Центральная, д. 1
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 18, mb: 1 }}>
              <Link href="mailto:info@itconsulting.com" color="inherit" underline="hover" sx={{ fontWeight: 700, fontSize: 18 }}>
                info@itconsulting.com
              </Link>
              {' | '}
              <Link href="tel:+74951234567" color="inherit" underline="hover" sx={{ fontWeight: 700, fontSize: 18 }}>
                +7 (495) 123-45-67
              </Link>
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
            <Box display="flex" justifyContent="center" gap={3}>
              <Link component={RouterLink} to="/privacy" color="inherit" underline="hover" sx={{ fontSize: 16, fontWeight: 500 }}>
                Политика конфиденциальности
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: 16, fontWeight: 500 }}>
                Презентация
              </Link>
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