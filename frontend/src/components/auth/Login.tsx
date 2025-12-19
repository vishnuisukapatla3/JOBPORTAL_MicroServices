import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert, Link, Divider } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import '../../styles/creative-theme.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const motivationalMessages = [
    "Welcome back! Your next opportunity awaits! 🚀",
    "Great to see you again! Let's find your dream job! 🎯",
    "Ready to take the next step in your career? 💪",
    "Your future starts here! Let's make it happen! ✨",
    "Success is just one login away! 🌟"
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % motivationalMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);

      // Get user data from localStorage after successful login
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        // Redirect based on role
        switch (user.role) {
          case 'JOB_SEEKER':
            navigate('/jobs');
            break;
          case 'RECRUITER':
            navigate('/employer/dashboard');
            break;
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/jobs');
        }
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="login-page"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ padding: { xs: 2, sm: 4 }, position: 'relative' }}
    >
      {/* Floating Background Shapes */}
      <Box className="bg-shape bg-shape-1" />
      <Box className="bg-shape bg-shape-2" />
      <Paper
        className="revjobs-card"
        sx={{
          p: { xs: 3, sm: 4 },
          maxWidth: 450,
          width: '100%',
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 30px 90px rgba(0,0,0,0.3)'
        }}
      >
        {/* Motivational Message */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            textAlign: 'center',
            animation: 'fadeIn 1s ease-out'
          }}
        >
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
            {motivationalMessages[currentMessage]}
          </Typography>
        </Box>
        <Box textAlign="center" mb={4}>
          <Box className="revjobs-icon-circle">
            <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a202c' }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Sign in to find your dream job
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}



        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.8, fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Quick Tip */}
          <Box className="tips-card" sx={{ mt: 3, p: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ff6b6b', mb: 1 }}>
              💡 Career Tip:
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Update your profile regularly to increase your chances of being discovered by recruiters!
            </Typography>
          </Box>
        </form>

        <Box className="rainbow-divider" sx={{ my: 3 }} />

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" sx={{ fontWeight: 600 }}>
              Sign up here
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <Link component={RouterLink} to="/forgot-password" sx={{ fontWeight: 600 }}>
              Forgot Password?
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;