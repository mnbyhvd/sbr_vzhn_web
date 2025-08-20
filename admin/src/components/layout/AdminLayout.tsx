import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, AppBar, IconButton, Avatar, Menu, MenuItem, useTheme, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import WorkIcon from '@mui/icons-material/Work';
import HandshakeIcon from '@mui/icons-material/Handshake';
import DirectionsIcon from '@mui/icons-material/Directions';
import GroupIcon from '@mui/icons-material/Group';
import QuizIcon from '@mui/icons-material/Quiz';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import PublicIcon from '@mui/icons-material/Public';

const drawerWidth = 240;

const navItems = [
  { text: 'Дашборд', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Проекты', icon: <BusinessCenterIcon />, path: '/projects' },
  { text: 'Вакансии', icon: <WorkIcon />, path: '/vacancies' },
  { text: 'Отклики на вакансии', icon: <MailOutlineIcon />, path: '/vacancies/responses' },
  { text: 'Команда', icon: <GroupIcon />, path: '/team' },
  { text: 'FAQ', icon: <QuizIcon />, path: '/faq' },
  { text: 'Партнеры', icon: <HandshakeIcon />, path: '/partners' },
  { text: 'Направления', icon: <DirectionsIcon />, path: '/directions' },
  { text: 'Международный опыт', icon: <PublicIcon />, path: '/international-experience' },
  { text: 'Заявки', icon: <MailOutlineIcon />, path: '/requests' },
  { text: 'Настройки', icon: <SettingsIcon />, path: '/settings' },
];

const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1A59DE 60%, #A4C2E8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 1,
      }}
    >
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: 1, fontSize: 18 }}>
        СВ
      </Typography>
    </Box>
    <Typography
      variant="h6"
      sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1, fontSize: 18 }}
      component={RouterLink}
      to="/dashboard"
      style={{ textDecoration: 'none' }}
    >
      Admin
    </Typography>
  </Box>
);

const AdminLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(135deg, #F7F9FB 60%, #A4C2E8 100%)', borderRight: '1.5px solid #E3EAF6', display: 'flex', flexDirection: 'column', minHeight: '100vh', pt: 2 }}>
      <Logo />
      <List sx={{ mt: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 3,
                mx: 1.5,
                py: 1.2,
                px: 2,
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                background: location.pathname === item.path ? 'rgba(26,89,222,0.10)' : 'transparent',
                fontWeight: location.pathname === item.path ? 700 : 500,
                boxShadow: location.pathname === item.path ? '0 2px 8px 0 rgba(26,89,222,0.08)' : 'none',
                transition: 'all 0.18s',
                '&:hover': {
                  background: 'rgba(26,89,222,0.13)',
                  color: 'primary.main',
                },
              }}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ fontWeight: 'inherit' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box flexGrow={1} />
      <Box sx={{ textAlign: 'center', pb: 2, opacity: 0.5, fontSize: 13 }}>
        © {new Date().getFullYear()} Сайбервижн
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'background.default' }}>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'rgba(255,255,255,0.97)', color: 'text.primary', boxShadow: '0 2px 12px 0 rgba(26,89,222,0.04)', borderBottom: '1.5px solid #E3EAF6' }}>
        <Toolbar sx={{ minHeight: 68 }}>
          {isMobile && (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={handleProfileMenuOpen} color="primary" sx={{ ml: 1 }}>
            <Avatar alt="Admin" src="/admin-avatar.png" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleProfileMenuClose}>Профиль</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>Выйти</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {/* Drawer для desktop и mobile */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Temporary Drawer для mobile */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: 'linear-gradient(135deg, #F7F9FB 60%, #A4C2E8 100%)', borderRight: '1.5px solid #E3EAF6' },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: 'linear-gradient(135deg, #F7F9FB 60%, #A4C2E8 100%)', borderRight: '1.5px solid #E3EAF6' },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box component="main" sx={{ flexGrow: 1, flex: 1, minHeight: '100vh', background: 'background.default', width: '100%' }}>
        <Toolbar sx={{ minHeight: 68 }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout; 