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
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, pb: 4 }}>
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 4 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            size="large"
          >
            Go Home
          </Button>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleGoBack}
            size="large"
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}; 