import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper
} from '@mui/material';
import {
  Home as HomeIcon,
  Login as LoginIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoLogin = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, pb: 4 }}>
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <SecurityIcon sx={{ fontSize: '4rem', color: 'error.main', mb: 2 }} />
        <Typography variant="h1" component="h1" sx={{ fontSize: '4rem', fontWeight: 'bold', color: 'error.main', mb: 2 }}>
          401
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Unauthorized Access
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 4 }}>
          You don't have permission to access this page. Please log in with appropriate credentials.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={handleGoLogin}
            size="large"
          >
            Login
          </Button>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            size="large"
          >
            Go Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}; 