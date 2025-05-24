import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Link, Typography } from '@mui/material';
import { AuthLayout } from '../components/AuthLayout';
import { LoginForm } from '../components/LoginForm';
import { ROUTES } from '@/shared/utils';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/', { replace: true });
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back! Please sign in to your account.">
      <LoginForm onSuccess={handleLoginSuccess} showTitle={false} />
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component={RouterLink} to="/forgot-password" variant="body2">
          Forgot password?
        </Link>
      </Box>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Link component={RouterLink} to={ROUTES.REGISTER} variant="body2">
            Sign up
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}; 