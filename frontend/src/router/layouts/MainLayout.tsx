import React, { ReactNode } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { AppNavigation } from '../components/AppNavigation';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showBreadcrumbs?: boolean;
}

const DRAWER_WIDTH = 250;

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showSidebar = false,
  showBreadcrumbs = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppNavigation />
      
      {showSidebar && !isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', p: 2 }}>
            {/* Sidebar content can be added here */}
          </Box>
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: showSidebar && !isMobile ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar />
        
        {showBreadcrumbs && <Breadcrumbs />}
        
        <Box sx={{ flexGrow: 1, p: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}; 