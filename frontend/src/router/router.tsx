import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { RouteGuard } from './components/RouteGuard';
import { ResponsiveLayout } from './layouts/ResponsiveLayout';
import { ROUTE_PATHS, ROUTE_GUARDS } from './routes';

import { LoginPage, RegisterPage } from '@/modules/auth';
import { ProfilePage, EditProfilePage, UserListPage } from '@/modules/user';
import { FeedPage } from '@/modules/post';
import { FriendsPage, PeoplePage } from '@/modules/social/pages';
import { MessagingPage } from '@/modules/messaging';
import { NotificationsPage } from '@/modules/notification';

import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ServerErrorPage } from './pages/ServerErrorPage';

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}
  >
    <CircularProgress />
  </Box>
);

const createGuardedRoute = (
  Component: React.ComponentType, 
  guard?: keyof typeof ROUTE_GUARDS,
  layoutProps?: {
    showSidebar?: boolean;
    showBreadcrumbs?: boolean;
    showNavigation?: boolean;
  }
) => (
  <RouteGuard guard={guard}>
    <ResponsiveLayout {...layoutProps}>
      <Suspense fallback={<LoadingFallback />}>
        <Component />
      </Suspense>
    </ResponsiveLayout>
  </RouteGuard>
);

export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.HOME,
    element: createGuardedRoute(LandingPage, 'PUBLIC', { showNavigation: false }),
  },
  {
    path: ROUTE_PATHS.DASHBOARD,
    element: createGuardedRoute(HomePage, 'PROTECTED'),
  },
  {
    path: ROUTE_PATHS.AUTH.LOGIN,
    element: createGuardedRoute(LoginPage, 'GUEST_ONLY', { showNavigation: false }),
  },
  {
    path: ROUTE_PATHS.AUTH.REGISTER,
    element: createGuardedRoute(RegisterPage, 'GUEST_ONLY', { showNavigation: false }),
  },
  {
    path: ROUTE_PATHS.USER.PROFILE,
    element: createGuardedRoute(ProfilePage, 'PROTECTED'),
  },
  {
    path: ROUTE_PATHS.USER.PROFILE_BY_ID,
    element: createGuardedRoute(ProfilePage, 'PROTECTED'),
  },
  {
    path: ROUTE_PATHS.USER.EDIT_PROFILE,
    element: createGuardedRoute(EditProfilePage, 'PROTECTED'),
  },
  {
    path: ROUTE_PATHS.USER.USERS,
    element: createGuardedRoute(UserListPage, 'PROTECTED'),
  },
  {
    path: ROUTE_PATHS.POSTS.FEED,
    element: createGuardedRoute(FeedPage, 'PROTECTED'),
  },
  {
    path: ROUTE_PATHS.SOCIAL.FRIENDS,
    element: createGuardedRoute(FriendsPage, 'PROTECTED'),
  },
  {
    path: ROUTE_PATHS.SOCIAL.PEOPLE,
    element: createGuardedRoute(PeoplePage, 'PROTECTED'),
  },
  {
    path: ROUTE_PATHS.MESSAGING.MESSAGES,
    element: createGuardedRoute(MessagingPage, 'PROTECTED', { showSidebar: true }),
  },
  {
    path: ROUTE_PATHS.MESSAGING.CHAT,
    element: createGuardedRoute(MessagingPage, 'PROTECTED', { showSidebar: true }),
  },
  {
    path: ROUTE_PATHS.NOTIFICATIONS.NOTIFICATIONS,
    element: createGuardedRoute(NotificationsPage, 'PROTECTED'),
  },
  {
    path: ROUTE_PATHS.ERROR.NOT_FOUND,
    element: createGuardedRoute(NotFoundPage, 'PUBLIC', { showNavigation: false }),
  },
  {
    path: ROUTE_PATHS.ERROR.UNAUTHORIZED,
    element: createGuardedRoute(UnauthorizedPage, 'PUBLIC', { showNavigation: false }),
  },
  {
    path: ROUTE_PATHS.ERROR.SERVER_ERROR,
    element: createGuardedRoute(ServerErrorPage, 'PUBLIC', { showNavigation: false }),
  },
  {
    path: '*',
    element: <Navigate to={ROUTE_PATHS.ERROR.NOT_FOUND} replace />,
  },
]); 