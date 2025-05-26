import React from 'react';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Favorite as LikeIcon,
  Comment as CommentIcon,
  PersonAdd as FriendRequestIcon,
  Message as MessageIcon,
  AlternateEmail as MentionIcon,
  Info as SystemIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import type { Notification as NotificationData } from '../types/notification.types';
import { NotificationType } from '../types/notification.types';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationItemProps {
  notification: NotificationData;
  onClick?: (notificationId: string) => void;
  showActions?: boolean;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.LIKE:
      return <LikeIcon color="error" />;
    case NotificationType.COMMENT:
      return <CommentIcon color="primary" />;
    case NotificationType.FRIEND_REQUEST:
    case NotificationType.FRIEND_REQUEST_ACCEPTED:
      return <FriendRequestIcon color="success" />;
    case NotificationType.MESSAGE:
      return <MessageIcon color="info" />;
    case NotificationType.POST_MENTION:
    case NotificationType.COMMENT_MENTION:
      return <MentionIcon color="warning" />;
    case NotificationType.SYSTEM:
      return <SystemIcon color="action" />;
    default:
      return <SystemIcon color="action" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.LIKE:
      return 'error';
    case NotificationType.COMMENT:
      return 'primary';
    case NotificationType.FRIEND_REQUEST:
    case NotificationType.FRIEND_REQUEST_ACCEPTED:
      return 'success';
    case NotificationType.MESSAGE:
      return 'info';
    case NotificationType.POST_MENTION:
    case NotificationType.COMMENT_MENTION:
      return 'warning';
    case NotificationType.SYSTEM:
      return 'default';
    default:
      return 'default';
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  showActions = true
}) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    onClick?.(notification.id);
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <ListItem
      sx={{
        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
        borderLeft: notification.isRead ? 'none' : '4px solid',
        borderLeftColor: notification.isRead ? 'transparent' : `${getNotificationColor(notification.type)}.main`,
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.selected'
        }
      }}
      onClick={handleClick}
      secondaryAction={
        showActions && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {!notification.isRead && (
              <Tooltip title="Mark as read">
                <IconButton size="small" onClick={handleMarkAsRead}>
                  <MarkReadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    >
      <ListItemAvatar>
        {notification.actor?.avatar ? (
          <Avatar src={notification.actor.avatar} alt={notification.actor.username} />
        ) : (
          <Avatar>
            {getNotificationIcon(notification.type)}
          </Avatar>
        )}
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: notification.isRead ? 'normal' : 'medium',
                flexGrow: 1
              }}
            >
              {notification.title}
            </Typography>
            <Chip
              label={notification.type.replace('_', ' ').toLowerCase()}
              size="small"
              color={getNotificationColor(notification.type) as any}
              variant="outlined"
            />
          </Box>
        }
        secondary={
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 0.5
              }}
            >
              {notification.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTimeAgo(notification.createdAt)}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
}; 