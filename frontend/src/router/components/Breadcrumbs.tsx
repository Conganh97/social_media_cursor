import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ROUTE_PATHS, getRouteBreadcrumb } from '../routes';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive: boolean;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (isAuthenticated) {
      breadcrumbs.push({
        label: 'Dashboard',
        path: ROUTE_PATHS.DASHBOARD,
        isActive: false
      });
    } else {
      breadcrumbs.push({
        label: 'Home',
        path: ROUTE_PATHS.HOME,
        isActive: false
      });
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      let label = getRouteBreadcrumb(currentPath);
      
      if (label === 'Page') {
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      if (currentPath !== ROUTE_PATHS.HOME && currentPath !== ROUTE_PATHS.DASHBOARD) {
        breadcrumbs.push({
          label,
          path: currentPath,
          isActive: isLast
        });
      }
    });

    if (breadcrumbs.length === 1 && location.pathname === (isAuthenticated ? ROUTE_PATHS.DASHBOARD : ROUTE_PATHS.HOME)) {
      breadcrumbs[0].isActive = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ py: 1, px: 2 }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((breadcrumb, index) => {
          if (breadcrumb.isActive) {
            return (
              <Typography key={breadcrumb.path} color="text.primary">
                {breadcrumb.label}
              </Typography>
            );
          }

          return (
            <Link
              key={breadcrumb.path}
              underline="hover"
              color="inherit"
              onClick={() => handleBreadcrumbClick(breadcrumb.path)}
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {index === 0 && <HomeIcon sx={{ mr: 0.5, fontSize: 16 }} />}
              {breadcrumb.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
}; 