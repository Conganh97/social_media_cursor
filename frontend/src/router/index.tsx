import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/utils';
import { LoginPage, RegisterPage, ProtectedRoute } from '@/modules/auth';
import { ProfilePage, EditProfilePage, UserListPage } from '@/modules/user';
import { FeedPage } from '@/modules/post';
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
  Settings 
} from '@mui/icons-material';

const HomePage = () => (
  <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Social Media App
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Connect with friends, share moments, and build your community
      </Typography>
    </Box>

    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Manage your profile and personal information
          </Typography>
          <Button variant="contained" href="/profile" size="small">
            View Profile
          </Button>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <Feed sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Feed
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            See what's happening in your network
          </Typography>
          <Button variant="contained" href="/feed" size="small">
            View Feed
          </Button>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <People sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Friends
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Connect with friends and make new ones
          </Typography>
          <Button variant="contained" href="/friends" size="small">
            Find Friends
          </Button>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <Message sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Messages
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Chat with your friends privately
          </Typography>
          <Button variant="contained" href="/messages" size="small">
            View Messages
          </Button>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <Notifications sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Stay updated with latest activities
          </Typography>
          <Button variant="contained" href="/notifications" size="small">
            View Notifications
          </Button>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
          <Settings sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Customize your app experience
          </Typography>
          <Button variant="contained" href="/settings" size="small">
            Open Settings
          </Button>
        </Paper>
      </Grid>
    </Grid>
  </Container>
);

const MessagesPage = () => <div>Messages Page - Coming Soon</div>;
const NotificationsPage = () => <div>Notifications Page - Coming Soon</div>;
const FriendsPage = () => <div>Friends Page - Coming Soon</div>;
const SettingsPage = () => <div>Settings Page - Coming Soon</div>;
const NotFoundPage = () => <div>404 - Page Not Found</div>;

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <ProtectedRoute requireAuth={false}>
        <LoginPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <ProtectedRoute requireAuth={false}>
        <RegisterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/:id',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile/edit',
    element: (
      <ProtectedRoute>
        <EditProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <UserListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.FEED,
    element: (
      <ProtectedRoute>
        <FeedPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.MESSAGES,
    element: (
      <ProtectedRoute>
        <MessagesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: (
      <ProtectedRoute>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.FRIENDS,
    element: (
      <ProtectedRoute>
        <FriendsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.NOT_FOUND} replace />,
  },
]); 