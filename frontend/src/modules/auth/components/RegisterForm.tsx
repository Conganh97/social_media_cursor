import React from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useAuthForm } from '../hooks/useAuthForm';
import { RegisterData } from '../types/auth.types';

interface RegisterFormProps {
  onSuccess?: () => void;
  showTitle?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSuccess, 
  showTitle = true 
}) => {
  const { register } = useAuth();

  const {
    errors,
    isSubmitting,
    handleSubmit,
    getFieldProps,
  } = useAuthForm({
    type: 'register',
    onSubmit: async (data) => {
      const result = await register(data as RegisterData);
      if (result.meta.requestStatus === 'fulfilled' && onSuccess) {
        onSuccess();
      }
      return result;
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {showTitle && (
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
      )}

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            autoFocus
            disabled={isSubmitting}
            {...getFieldProps('firstName')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            disabled={isSubmitting}
            {...getFieldProps('lastName')}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            disabled={isSubmitting}
            {...getFieldProps('username')}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            disabled={isSubmitting}
            {...getFieldProps('email')}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            disabled={isSubmitting}
            {...getFieldProps('password')}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            disabled={isSubmitting}
            {...getFieldProps('confirmPassword')}
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
      >
        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </Box>
  );
}; 