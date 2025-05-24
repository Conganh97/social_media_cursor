import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/utils';

const HomePage = () => <div>Home Page - Coming Soon</div>;
const LoginPage = () => <div>Login Page - Coming Soon</div>;
const RegisterPage = () => <div>Register Page - Coming Soon</div>;
const ProfilePage = () => <div>Profile Page - Coming Soon</div>;
const FeedPage = () => <div>Feed Page - Coming Soon</div>;
const MessagesPage = () => <div>Messages Page - Coming Soon</div>;
const NotificationsPage = () => <div>Notifications Page - Coming Soon</div>;
const FriendsPage = () => <div>Friends Page - Coming Soon</div>;
const SettingsPage = () => <div>Settings Page - Coming Soon</div>;
const NotFoundPage = () => <div>404 - Page Not Found</div>;

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
  },
  {
    path: '/profile/:id',
    element: <ProfilePage />,
  },
  {
    path: ROUTES.FEED,
    element: <FeedPage />,
  },
  {
    path: ROUTES.MESSAGES,
    element: <MessagesPage />,
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: <NotificationsPage />,
  },
  {
    path: ROUTES.FRIENDS,
    element: <FriendsPage />,
  },
  {
    path: ROUTES.SETTINGS,
    element: <SettingsPage />,
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