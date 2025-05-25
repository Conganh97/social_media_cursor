import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
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
import { UserProfile } from '../types/user.types';
import { UserAvatar } from './UserAvatar';

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
    if (user.isFollowing && onUnfollow) {
      onUnfollow(user.id);
    } else if (!user.isFollowing && onFollow) {
      onFollow(user.id);
    }
  };

  const handleMessageClick = () => {
    if (onMessage) {
      onMessage(user.id);
    }
  };

  const handleProfileClick = () => {
    if (onViewProfile) {
      onViewProfile(user.id);
    }
  };

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick(user.id);
    }
  };

  const renderStats = () => {
    if (!showStats) return null;
    
    return (
      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
        <Typography variant="caption" color="textSecondary">
          {user.postCount || 0} posts
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {user.followerCount || 0} followers
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {user.followingCount || 0} following
        </Typography>
      </Box>
    );
  };

  const renderActions = () => {
    if (!showActions) return null;
    
    return (
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Button
          variant={user.isFollowing ? "outlined" : "contained"}
          size="small"
          startIcon={user.isFollowing ? <PersonRemove /> : <PersonAdd />}
          onClick={handleFollowClick}
          disabled={isLoading}
          fullWidth
        >
          {user.isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Message />}
          onClick={handleMessageClick}
          fullWidth
        >
          Message
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
          p: 2,
          borderRadius: 1,
          '&:hover': {
            bgcolor: 'action.hover',
          },
          cursor: 'pointer',
        }}
        onClick={handleProfileClick}
      >
        <UserAvatar
          src={user.profilePictureUrl}
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
            src={user.profilePictureUrl}
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