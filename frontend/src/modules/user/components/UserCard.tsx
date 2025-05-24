import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PersonAdd,
  PersonRemove,
  Message,
  MoreVert,
  LocationOn,
  Verified,
} from '@mui/icons-material';
import { UserAvatar } from './UserAvatar';
import { UserProfile, FriendshipStatus } from '../types/user.types';

interface UserCardProps {
  user: UserProfile;
  compact?: boolean;
  showStats?: boolean;
  showActions?: boolean;
  onFollow?: (userId: number) => void;
  onUnfollow?: (userId: number) => void;
  onMessage?: (userId: number) => void;
  onViewProfile?: (userId: number) => void;
  onMenuClick?: (userId: number) => void;
  isLoading?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  compact = false,
  showStats = true,
  showActions = true,
  onFollow,
  onUnfollow,
  onMessage,
  onViewProfile,
  onMenuClick,
  isLoading = false,
}) => {
  const handleFollowClick = () => {
    if (user.isFollowing) {
      onUnfollow?.(user.id);
    } else {
      onFollow?.(user.id);
    }
  };

  const handleMessageClick = () => {
    onMessage?.(user.id);
  };

  const handleProfileClick = () => {
    onViewProfile?.(user.id);
  };

  const handleMenuClick = () => {
    onMenuClick?.(user.id);
  };

  const renderStats = () => {
    if (!showStats) return null;

    return (
      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <Typography variant="body2" color="textSecondary">
          <strong>{user.postCount}</strong> posts
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>{user.followerCount}</strong> followers
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>{user.followingCount}</strong> following
        </Typography>
      </Box>
    );
  };

  const renderActions = () => {
    if (!showActions) return null;

    return (
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        {user.friendshipStatus !== FriendshipStatus.BLOCKED && (
          <>
            <Button
              variant={user.isFollowing ? 'outlined' : 'contained'}
              size="small"
              startIcon={user.isFollowing ? <PersonRemove /> : <PersonAdd />}
              onClick={handleFollowClick}
              disabled={isLoading}
            >
              {user.isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
            
            <Button
              variant="outlined"
              size="small"
              startIcon={<Message />}
              onClick={handleMessageClick}
            >
              Message
            </Button>
          </>
        )}
        
        <Button
          variant="text"
          size="small"
          onClick={handleProfileClick}
        >
          View Profile
        </Button>
      </Box>
    );
  };

  if (compact) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 1,
          '&:hover': {
            bgcolor: 'action.hover',
          },
          cursor: 'pointer',
        }}
        onClick={handleProfileClick}
      >
        <UserAvatar
          src={user.avatarUrl}
          firstName={user.firstName}
          lastName={user.lastName}
          size="small"
        />
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {user.firstName} {user.lastName}
            </Typography>
            {user.isEmailVerified && (
              <Verified fontSize="small" color="primary" />
            )}
          </Box>
          <Typography variant="body2" color="textSecondary" noWrap>
            @{user.username}
          </Typography>
          {user.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="caption" color="textSecondary" noWrap>
                {user.location}
              </Typography>
            </Box>
          )}
        </Box>

        {showActions && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleFollowClick();
              }}
              disabled={isLoading}
            >
              {user.isFollowing ? <PersonRemove /> : <PersonAdd />}
            </IconButton>
            
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleMessageClick();
              }}
            >
              <Message />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 345, m: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <UserAvatar
            src={user.avatarUrl}
            firstName={user.firstName}
            lastName={user.lastName}
            size="large"
            onClick={handleProfileClick}
          />
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="h6" noWrap>
                {user.firstName} {user.lastName}
              </Typography>
              {user.isEmailVerified && (
                <Tooltip title="Verified user">
                  <Verified fontSize="small" color="primary" />
                </Tooltip>
              )}
              {user.isPrivate && (
                <Chip label="Private" size="small" variant="outlined" />
              )}
            </Box>
            
            <Typography variant="body2" color="textSecondary" gutterBottom>
              @{user.username}
            </Typography>
            
            {user.bio && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                {user.bio}
              </Typography>
            )}
            
            {user.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <LocationOn fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  {user.location}
                </Typography>
              </Box>
            )}
            
            {renderStats()}
          </Box>
          
          {onMenuClick && (
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ alignSelf: 'flex-start' }}
            >
              <MoreVert />
            </IconButton>
          )}
        </Box>
        
        {renderActions()}
      </CardContent>
    </Card>
  );
}; 