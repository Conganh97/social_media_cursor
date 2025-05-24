import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Link, Typography } from '@mui/material';
import { AuthLayout } from '../components/AuthLayout';
import { RegisterForm } from '../components/RegisterForm';
import { ROUTES } from '@/shared/utils';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/', { replace: true });
  };

  return (
    <AuthLayout title="Sign Up" subtitle="Create a new account to get started.">
      <RegisterForm onSuccess={handleRegisterSuccess} showTitle={false} />
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2">
            Sign in
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}; 