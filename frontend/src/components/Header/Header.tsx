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
      component={RouterLink}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        height: 32, // Уменьшили высоту
        maxWidth: '100%',
        transition: 'opacity 0.2s',
        '&:hover': {
          opacity: 0.8,
        },
      }}
    >
      <img
        src="/logo1.png"
        alt="СайберВижн"
        style={{
          height: '100%',
          width: 'auto',
          maxWidth: '120px', // Уменьшили максимальную ширину
          objectFit: 'contain',
          border: 'none',
          outline: 'none',
        }}
      />
    </Box>
    <Typography
      variant="h6"
      sx={{ 
        color: 'primary.main', 
        fontWeight: 700, 
        letterSpacing: 1,
        ml: 2, // Добавили отступ между лого и текстом
      }}
      component={RouterLink}
      to="/"
      style={{ textDecoration: 'none' }}
    >
      saybervizhn
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
    <Box
      sx={{
        display: 'flex',
        gap: 3,
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
            textTransform: 'none',
            fontSize: 16,
            px: 0,
            py: 1,
            background: 'transparent',
            transition: 'color 0.2s',
            '&:hover': {
              background: 'transparent',
              color: primaryColor,
            },
          }}
        >
              {link.label}
            </Button>
          ))}
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.95)',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: 'none',
        zIndex: 1000, // Фиксированный z-index
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72, px: { xs: 3, md: 6 } }}>
        <Logo />
        {isMobile ? (
          <>
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ color: 'primary.main' }} />
          </IconButton>
            <Drawer 
              anchor="right" 
              open={drawerOpen} 
              onClose={() => setDrawerOpen(false)}
              sx={{
                zIndex: 9999, // Максимальный z-index для всего Drawer
                '& .MuiDrawer-paper': {
                  zIndex: 9999, // Максимальный z-index для бумаги
                  width: 260,
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  height: '100vh',
                },
              }}
            >
              <Box sx={{ width: 260, p: 2, pt: 4 }}>
              {navLinks.map(link => (
                  <List key={link.to}>
                    <ListItem disablePadding>
                      <ListItemButton
                        component={RouterLink}
                        to={link.to}
                        selected={location.pathname === link.to}
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                          borderRadius: 1,
                          mb: 0.5,
                          '&.Mui-selected': {
                            backgroundColor: `${primaryColor}15`,
                            color: primaryColor,
                          },
                          '&:hover': {
                            backgroundColor: `${primaryColor}10`,
                          },
                        }}
                      >
                        <ListItemText 
                          primary={link.label} 
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontWeight: location.pathname === link.to ? 600 : 400,
                            },
                          }}
                        />
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