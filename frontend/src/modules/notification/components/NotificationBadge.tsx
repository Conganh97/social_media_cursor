import React from 'react';
import { Badge, IconButton } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';

interface NotificationBadgeProps {
  count: number;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  showZero?: boolean;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  onClick,
  color = 'error',
  size = 'medium',
  showZero = false
}) => {
  return (
    <IconButton onClick={onClick} size={size} color="inherit">
      <Badge
        badgeContent={count}
        color={color}
        showZero={showZero}
        max={99}
      >
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
}; 