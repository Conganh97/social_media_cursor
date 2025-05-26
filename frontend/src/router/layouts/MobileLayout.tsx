import React, { ReactNode } from 'react';
import {
  Box,
  Toolbar
} from '@mui/material';
import { AppNavigation } from '../components/AppNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  showNavigation = true
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showNavigation && <AppNavigation />}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: showNavigation ? 'calc(100vh - 64px)' : '100vh'
        }}
      >
        {showNavigation && <Toolbar />}
        
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}; 