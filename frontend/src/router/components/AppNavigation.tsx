import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Feed as FeedIcon,
  People as PeopleIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { logoutAsync } from '@/modules/auth/store/authSlice';
import { ROUTE_PATHS } from '../routes';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  requireAuth?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: ROUTE_PATHS.DASHBOARD,
    icon: <DashboardIcon />,
    requireAuth: true,
  },
  {
    label: 'Feed',
    path: ROUTE_PATHS.POSTS.FEED,
    icon: <FeedIcon />,
    requireAuth: true,
  },
  {
    label: 'Friends',
    path: ROUTE_PATHS.SOCIAL.FRIENDS,
    icon: <PeopleIcon />,
    requireAuth: true,
  },
  {
    label: 'Messages',
    path: ROUTE_PATHS.MESSAGING.MESSAGES,
    icon: <MessageIcon />,
    requireAuth: true,
  },
  {
    label: 'Notifications',
    path: ROUTE_PATHS.NOTIFICATIONS.NOTIFICATIONS,
    icon: <NotificationsIcon />,
    requireAuth: true,
  },
];

export const AppNavigation: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notification);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
    handleProfileMenuClose();
    navigate(ROUTE_PATHS.HOME);
  };

  const filteredNavigationItems = navigationItems.filter(
    item => !item.requireAuth || isAuthenticated
  );

  const renderNavigationItems = () => (
    <List>
      {filteredNavigationItems.map((item) => (
        <ListItem key={item.path} disablePadding>
          <ListItemButton
            selected={location.pathname === item.path}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>
              {item.label === 'Notifications' ? (
                <Badge badgeContent={unreadCount} color="error">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Social App
        </Typography>
      </Toolbar>
      <Divider />
      {renderNavigationItems()}
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && isAuthenticated && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate(isAuthenticated ? ROUTE_PATHS.DASHBOARD : ROUTE_PATHS.HOME)}
          >
            Social Media App
          </Typography>

          {!isMobile && isAuthenticated && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {filteredNavigationItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={
                    item.label === 'Notifications' ? (
                      <Badge badgeContent={unreadCount} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )
                  }
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {isAuthenticated ? (
            <Box sx={{ ml: 2 }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem onClick={() => { handleNavigation(ROUTE_PATHS.USER.PROFILE); handleProfileMenuClose(); }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleNavigation(ROUTE_PATHS.SETTINGS.GENERAL); handleProfileMenuClose(); }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" onClick={() => navigate(ROUTE_PATHS.AUTH.LOGIN)}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate(ROUTE_PATHS.AUTH.REGISTER)}>
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {isMobile && isAuthenticated && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
}; 