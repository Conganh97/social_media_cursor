import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid
} from '@mui/material';
import {
  Person,
  Feed,
  Message,
  Notifications,
  People,
  Settings,
  Login as LoginIcon,
  PersonAdd
} from '@mui/icons-material';

export const LandingPage: React.FC = () => (
  <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Social Media App
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Connect with friends, share moments, and build your community
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="contained" href="/login" startIcon={<LoginIcon />} size="large">
          Login
        </Button>
        <Button variant="outlined" href="/register" startIcon={<PersonAdd />} size="large">
          Register
        </Button>
      </Box>
    </Box>

    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Profile Management
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Create and customize your personal profile with photos and information
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <Feed sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Social Feed
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Share posts, photos, and updates with your friends and followers
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <People sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Connect with Friends
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Find and connect with friends, send requests, and build your network
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <Message sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Real-time Messaging
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Chat with friends privately with instant messaging and notifications
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <Notifications sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Smart Notifications
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Stay updated with real-time notifications for likes, comments, and messages
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <Settings sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Customizable Experience
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Personalize your app experience with themes and privacy settings
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  </Container>
); 