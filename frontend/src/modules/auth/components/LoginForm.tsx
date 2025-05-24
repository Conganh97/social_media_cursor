import React from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useAuthForm } from '../hooks/useAuthForm';
import { LoginCredentials } from '../types/auth.types';

interface LoginFormProps {
  onSuccess?: () => void;
  showTitle?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  showTitle = true 
}) => {
  const { login } = useAuth();

  const {
    errors,
    isSubmitting,
    handleSubmit,
    getFieldProps,
  } = useAuthForm({
    type: 'login',
    onSubmit: async (data) => {
      const result = await login(data as LoginCredentials);
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
          Sign In
        </Typography>
      )}

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        type="email"
        disabled={isSubmitting}
        {...getFieldProps('email')}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        disabled={isSubmitting}
        {...getFieldProps('password')}
      />

      <FormControlLabel
        control={
          <Checkbox 
            {...getFieldProps('rememberMe')}
            color="primary"
            disabled={isSubmitting}
          />
        }
        label="Remember me"
        sx={{ mt: 1 }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
      >
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </Button>
    </Box>
  );
}; 