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
  Refresh as RefreshIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, pb: 4 }}>
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: '4rem', color: 'error.main', mb: 2 }} />
        <Typography variant="h1" component="h1" sx={{ fontSize: '4rem', fontWeight: 'bold', color: 'error.main', mb: 2 }}>
          500
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Server Error
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 4 }}>
          Something went wrong on our end. Please try again later or contact support if the problem persists.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="large"
          >
            Try Again
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