import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useColors } from '../../contexts/ColorContext';

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/directions', label: 'Направления' },
  { to: '/projects', label: 'Проекты' },
  { to: '/vacancies', label: 'Вакансии' },
];

const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1A59DE 60%, #A4C2E8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 1,
      }}
    >
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1 }}>
        СВ
      </Typography>
    </Box>
    <Typography
      variant="h6"
      sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1 }}
      component={RouterLink}
      to="/"
      style={{ textDecoration: 'none' }}
    >
      СайберВижн
    </Typography>
  </Box>
);

const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { colors, isHomePage } = useColors();

  // Используем цвета из админки только на главной странице
  const primaryColor = isHomePage ? colors.primary : theme.palette.primary.main;
  const backgroundColor = isHomePage ? colors.background : theme.palette.background.default;

  const navBlock = (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        borderRadius: 999,
        background: backgroundColor,
        px: 2,
        py: 0.5,
        gap: 1,
        alignItems: 'center',
      }}
    >
          {navLinks.map(link => (
        <Button
          key={link.to}
          component={RouterLink}
          to={link.to}
          sx={{
            color: location.pathname === link.to ? primaryColor : theme.palette.text.primary,
            fontWeight: location.pathname === link.to ? 700 : 500,
            borderRadius: 999,
            px: 2,
            background: location.pathname === link.to ? `${primaryColor}15` : 'transparent',
            transition: 'all 0.2s',
            '&:hover': {
              background: `${primaryColor}20`,
            },
          }}
        >
              {link.label}
            </Button>
          ))}
    </Paper>
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.95)',
        color: 'text.primary',
        boxShadow: '0 2px 12px 0 rgba(26,89,222,0.04)',
        borderBottom: '1px solid #E3EAF6',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72 }}>
        <Logo />
        {isMobile ? (
          <>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ color: 'primary.main' }} />
          </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={{ width: 260, p: 2 }}>
              {navLinks.map(link => (
                  <List key={link.to}>
                    <ListItem disablePadding>
                      <ListItemButton
                        component={RouterLink}
                        to={link.to}
                        selected={location.pathname === link.to}
                        onClick={() => setDrawerOpen(false)}
                      >
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                </ListItem>
            </List>
                ))}
          </Box>
        </Drawer>
          </>
        ) : (
          navBlock
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 