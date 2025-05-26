import React, { ReactNode } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { MainLayout } from './MainLayout';
import { MobileLayout } from './MobileLayout';

interface ResponsiveLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showBreadcrumbs?: boolean;
  showNavigation?: boolean;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  showSidebar = false,
  showBreadcrumbs = true,
  showNavigation = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <MobileLayout showNavigation={showNavigation}>
        {children}
      </MobileLayout>
    );
  }

  return (
    <MainLayout 
      showSidebar={showSidebar} 
      showBreadcrumbs={showBreadcrumbs}
    >
      {children}
    </MainLayout>
  );
}; 