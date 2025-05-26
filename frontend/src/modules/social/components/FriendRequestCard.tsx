import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
} from '@mui/material';
import {
  Check,
  Close,
  MoreVert,
  Person,
  Block,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { FriendshipResponse } from '../types/social.types';

interface FriendRequestCardProps {
  request: FriendshipResponse;
  type: 'received' | 'sent';
  onAccept?: (requestId: number) => void;
  onReject?: (requestId: number) => void;
  onCancel?: (requestId: number) => void;
  onViewProfile?: (userId: number) => void;
  loading?: boolean;
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  type,
  onAccept,
  onReject,
  onCancel,
  onViewProfile,
  loading = false
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const user = type === 'received' ? request.requester : request.addressee;
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewProfile = () => {
    onViewProfile?.(user.id);
    handleMenuClose();
  };

  const getStatusChip = () => {
    const statusColor = {
      'PENDING': 'warning' as const,
      'ACCEPTED': 'success' as const,
      'DECLINED': 'error' as const,
    };

    return (
      <Chip
        label={request.status}
        size="small"
        color={statusColor[request.status]}
        variant="outlined"
      />
    );
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 2 } }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={user.profilePictureUrl}
            sx={{ width: 64, height: 64, cursor: 'pointer' }}
            onClick={handleViewProfile}
          >
            {user.firstName[0]}{user.lastName[0]}
          </Avatar>

          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Typography
                variant="h6"
                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                onClick={handleViewProfile}
              >
                {user.firstName} {user.lastName}
              </Typography>
              {getStatusChip()}
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              @{user.username}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {type === 'received' 
                ? `Sent you a friend request ${formatTimeAgo(request.createdAt)}`
                : `You sent a friend request ${formatTimeAgo(request.createdAt)}`
              }
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            {type === 'received' && request.status === 'PENDING' && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Check />}
                  onClick={() => onAccept?.(request.id)}
                  disabled={loading}
                >
                  Accept
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Close />}
                  onClick={() => onReject?.(request.id)}
                  disabled={loading}
                >
                  Decline
                </Button>
              </>
            )}

            {type === 'sent' && request.status === 'PENDING' && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Close />}
                onClick={() => onCancel?.(request.id)}
                disabled={loading}
              >
                Cancel
              </Button>
            )}

            <IconButton
              onClick={handleMenuClick}
              size="small"
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        {request.status !== 'PENDING' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {request.status === 'ACCEPTED' && 'Friend request accepted'}
                {request.status === 'DECLINED' && 'Friend request declined'}
              </Typography>
            </Box>
          </>
        )}
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewProfile}>
          <Person sx={{ mr: 1 }} fontSize="small" />
          View Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Block sx={{ mr: 1 }} fontSize="small" />
          Block User
        </MenuItem>
      </Menu>
    </Card>
  );
}; 