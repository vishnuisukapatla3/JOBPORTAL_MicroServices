import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, Avatar, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Work, AccountCircle, Dashboard, Message, Menu as MenuIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationBadge from '../ui/NotificationBadge';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const navButtonStyle = {
    transition: 'all 0.3s ease',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    '&:hover': {
      bgcolor: 'rgba(59, 130, 246, 0.1) !important',
      color: 'var(--primary-color) !important',
      transform: 'translateY(-2px)',
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0} className="theme-nav" sx={{ zIndex: 1100 }}>
        <Toolbar>
          <Work sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
            onClick={() => navigate('/')}>
            RevJobs
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Button color="inherit" onClick={() => navigate('/')} size="small" sx={{ ...navButtonStyle, bgcolor: isActive('/') ? 'rgba(255,255,255,0.2)' : 'transparent' }}>Home</Button>
            <Button color="inherit" onClick={() => navigate('/jobs')} size="small" sx={{ ...navButtonStyle, bgcolor: isActive('/jobs') ? 'rgba(255,255,255,0.2)' : 'transparent' }}>Jobs</Button>
            <Button color="inherit" onClick={() => navigate('/companies')} size="small" sx={{ ...navButtonStyle, bgcolor: isActive('/companies') ? 'rgba(255,255,255,0.2)' : 'transparent' }}>Companies</Button>
            <Button color="inherit" onClick={() => navigate('/services')} size="small" sx={{ ...navButtonStyle, bgcolor: isActive('/services') ? 'rgba(255,255,255,0.2)' : 'transparent' }}>Services</Button>
            <Button color="inherit" onClick={() => navigate('/careers')} size="small" sx={{ ...navButtonStyle, bgcolor: isActive('/careers') ? 'rgba(255,255,255,0.2)' : 'transparent' }}>Careers</Button>
            <Button color="inherit" onClick={() => navigate('/blog')} size="small" sx={{ ...navButtonStyle, bgcolor: isActive('/blog') ? 'rgba(255,255,255,0.2)' : 'transparent' }}>Blog</Button>
            {user ? (
              <>
                {user.role === 'JOB_SEEKER' && (
                  <>
                    <Button color="inherit" onClick={() => navigate('/applications')} size="small" sx={navButtonStyle}>Applications</Button>
                    <Button color="inherit" onClick={() => navigate('/profile')} size="small" sx={navButtonStyle}>Profile</Button>
                  </>
                )}
                {user.role === 'RECRUITER' && (
                  <>
                    <Button color="inherit" onClick={() => navigate('/employer/dashboard')} size="small" sx={navButtonStyle}>Dashboard</Button>
                    <Button color="inherit" onClick={() => navigate('/recruiter/dashboard')} size="small" sx={navButtonStyle}>Recruiter</Button>
                    <Button color="inherit" onClick={() => navigate('/jobs/create')} size="small" sx={navButtonStyle}>Post Job</Button>
                  </>
                )}
                {user.role === 'ADMIN' && (
                  <Button color="inherit" onClick={() => navigate('/admin/dashboard')} size="small" sx={navButtonStyle}>Admin</Button>
                )}
                <Button color="inherit" onClick={() => navigate('/messages')} size="small" sx={navButtonStyle}>Messages</Button>
                <NotificationBadge />
                <Button color="inherit" onClick={handleLogout} size="small" sx={navButtonStyle}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')} size="small" sx={navButtonStyle}>Login</Button>
                <Button color="inherit" onClick={() => navigate('/register')} size="small" sx={navButtonStyle}>Register</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: '100vh', paddingTop: '80px', position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;