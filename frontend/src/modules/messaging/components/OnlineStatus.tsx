import React from 'react';
import { Typography, Box } from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';

interface OnlineStatusProps {
  isOnline: boolean;
  lastSeen?: Date;
  showText?: boolean;
  size?: 'small' | 'medium';
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({
  isOnline,
  lastSeen,
  showText = true,
  size = 'small'
}) => {
  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const getStatusText = () => {
    if (isOnline) {
      return 'Online';
    } else if (lastSeen) {
      return `Last seen ${formatLastSeen(lastSeen)}`;
    } else {
      return 'Offline';
    }
  };

  const iconSize = size === 'small' ? 8 : 12;
  const textVariant = size === 'small' ? 'body2' : 'body1';

  if (!showText) {
    return (
      <CircleIcon
        sx={{
          fontSize: iconSize,
          color: isOnline ? 'success.main' : 'grey.400'
        }}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <CircleIcon
        sx={{
          fontSize: iconSize,
          color: isOnline ? 'success.main' : 'grey.400'
        }}
      />
      <Typography
        variant={textVariant}
        color={isOnline ? 'success.main' : 'text.secondary'}
        sx={{ fontSize: size === 'small' ? '0.75rem' : '0.875rem' }}
      >
        {getStatusText()}
      </Typography>
    </Box>
  );
};

export default OnlineStatus; 