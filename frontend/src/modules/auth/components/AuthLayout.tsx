import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlined />
          </Avatar>
          
          {title && (
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              {title}
            </Typography>
          )}
          
          {subtitle && (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 2 }}>
              {subtitle}
            </Typography>
          )}

          <Box sx={{ width: '100%' }}>
            {children}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}; 