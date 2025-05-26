import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  MarkEmailRead as MarkAllReadIcon
} from '@mui/icons-material';
import { NotificationItem } from './NotificationItem';
import { NotificationFilters, NotificationType } from '../types/notification.types';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationListProps {
  showGrouped?: boolean;
  showFilters?: boolean;
  maxHeight?: string | number;
  onNotificationClick?: (notificationId: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  showGrouped = false,
  showFilters = true,
  maxHeight = '400px',
  onNotificationClick
}) => {
  const {
    notifications,
    groupedNotifications,
    loading,
    error,
    hasMore,
    filters,
    fetchNotifications,
    markAllAsRead,
    setFilters,
    loadMore
  } = useNotifications();

  const [localFilters, setLocalFilters] = useState<NotificationFilters>(filters);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleFilterChange = (newFilters: Partial<NotificationFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters, offset: 0 };
    setLocalFilters(updatedFilters);
    setFilters(updatedFilters);
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && hasMore && !loading) {
      loadMore();
    }
  };

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <IconButton onClick={() => setShowFiltersPanel(!showFiltersPanel)} size="small">
            <FilterIcon />
          </IconButton>
          <Typography variant="subtitle2">Filters</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} size="small" disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark all as read">
            <IconButton onClick={handleMarkAllRead} size="small">
              <MarkAllReadIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {showFiltersPanel && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={localFilters.type || ''}
                label="Type"
                onChange={(e) => handleFilterChange({ type: e.target.value as NotificationType || undefined })}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value={NotificationType.LIKE}>Likes</MenuItem>
                <MenuItem value={NotificationType.COMMENT}>Comments</MenuItem>
                <MenuItem value={NotificationType.FRIEND_REQUEST}>Friend Requests</MenuItem>
                <MenuItem value={NotificationType.MESSAGE}>Messages</MenuItem>
                <MenuItem value={NotificationType.POST_MENTION}>Mentions</MenuItem>
                <MenuItem value={NotificationType.SYSTEM}>System</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={localFilters.isRead === false}
                  onChange={(e) => handleFilterChange({ isRead: e.target.checked ? false : undefined })}
                />
              }
              label="Unread only"
            />
          </Box>
        )}
      </Box>
    );
  };

  const renderGroupedNotifications = () => {
    if (groupedNotifications.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No notifications found
          </Typography>
        </Box>
      );
    }

    return (
      <>
        {groupedNotifications.map((group) => (
          <Box key={group.type}>
            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" color="primary">
                  {group.type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </Typography>
                <Chip label={group.count} size="small" color="primary" />
              </Box>
            </Box>
            <List disablePadding>
              {group.notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={onNotificationClick}
                />
              ))}
            </List>
            <Divider />
          </Box>
        ))}
      </>
    );
  };

  const renderNotifications = () => {
    if (notifications.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No notifications found
          </Typography>
        </Box>
      );
    }

    return (
      <List disablePadding>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={onNotificationClick}
          />
        ))}
      </List>
    );
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {renderFilters()}
      
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          maxHeight
        }}
        onScroll={handleScroll}
      >
        {showGrouped ? renderGroupedNotifications() : renderNotifications()}
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
    </Box>
  );
}; 