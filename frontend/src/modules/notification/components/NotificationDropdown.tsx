import React, { useState } from 'react';
import {
  Popover,
  Box,
  Typography,
  Divider,
  Button,
  Paper
} from '@mui/material';
import { NotificationList } from './NotificationList';
import { NotificationBadge } from './NotificationBadge';

interface NotificationDropdownProps {
  unreadCount: number;
  onNotificationClick?: (notificationId: string) => void;
  onViewAll?: () => void;
  maxHeight?: string | number;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  unreadCount,
  onNotificationClick,
  onViewAll,
  maxHeight = '400px'
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleBadgeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificationId: string) => {
    onNotificationClick?.(notificationId);
    handleClose();
  };

  const handleViewAll = () => {
    onViewAll?.();
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <NotificationBadge count={unreadCount} onClick={handleBadgeClick} />
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxWidth: '90vw',
            maxHeight: '80vh'
          }
        }}
      >
        <Paper elevation={0}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">
              Notifications
            </Typography>
          </Box>
          
          <NotificationList
            showFilters={false}
            maxHeight={maxHeight}
            onNotificationClick={handleNotificationClick}
          />
          
          <Divider />
          
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Button
              variant="text"
              color="primary"
              onClick={handleViewAll}
              fullWidth
            >
              View All Notifications
            </Button>
          </Box>
        </Paper>
      </Popover>
    </>
  );
}; 