import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert, FormControl, InputLabel, Select, MenuItem, Link, Divider } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import '../../styles/creative-theme.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'JOB_SEEKER',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const encouragingMessages = [
    "Start your journey to success today! 🌟",
    "Join thousands of successful job seekers! 🚀",
    "Your dream career is just a signup away! 🎯",
    "Build your future with us! 💪",
    "Take the first step towards greatness! ✨"
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % encouragingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Prevent admin registration for other emails
    if (formData.role === 'ADMIN' && formData.email !== 'sravanikelam27@gmail.com') {
      setError('Admin registration is restricted to authorized personnel only.');
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);

      // Store user profile data immediately after registration
      const userProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        companyName: formData.companyName || '',
        location: '',
        skills: [],
        experience: [],
        resumeUrl: ''
      };
      localStorage.setItem(`userProfile_${formData.email}`, JSON.stringify(userProfile));

      setSuccess('Registration successful! You can now login with your credentials.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="register-page"
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
          maxWidth: 500,
          width: '100%',
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 30px 90px rgba(0,0,0,0.3)'
        }}
      >
        {/* Encouraging Message */}
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
            {encouragingMessages[currentMessage]}
          </Typography>
        </Box>
        <Box textAlign="center" mb={4}>
          <Box className="revjobs-icon-circle">
            <PersonAdd sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a202c' }}>
            Join RevJobs
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Create your account and start your career journey
          </Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}


        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
            >
              <MenuItem value="JOB_SEEKER">Job Seeker</MenuItem>
              <MenuItem value="RECRUITER">Employer</MenuItem>
              {formData.email === 'sravanikelam27@gmail.com' && (
                <MenuItem value="ADMIN">🛡️ Admin</MenuItem>
              )}
            </Select>
          </FormControl>
          {formData.role === 'RECRUITER' && (
            <TextField
              fullWidth
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              margin="normal"
              required
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.8, fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Benefits Badge */}
          <Box className="badge-container" sx={{ justifyContent: 'center', mt: 2 }}>
            <Box className="achievement-badge" sx={{ fontSize: '0.85rem', py: 0.5, px: 2 }}>
              🎓 Free Profile
            </Box>
            <Box className="achievement-badge" sx={{ fontSize: '0.85rem', py: 0.5, px: 2 }}>
              💼 1000+ Jobs
            </Box>
            <Box className="achievement-badge" sx={{ fontSize: '0.85rem', py: 0.5, px: 2 }}>
              ⚡ Instant Apply
            </Box>
          </Box>
        </form>

        <Box className="rainbow-divider" sx={{ my: 3 }} />

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
              Sign in here
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

export default Register;