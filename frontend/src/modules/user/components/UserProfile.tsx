import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
} from '@mui/material';
import {
  Edit,
  PersonAdd,
  PersonRemove,
  Message,
  MoreVert,
  LocationOn,
  Language,
  CalendarToday,
  Email,
  Phone,
  Block,
  Report,
  Verified,
} from '@mui/icons-material';
import { UserAvatar } from './UserAvatar';
import { UserProfile as UserProfileType, FriendshipStatus } from '../types/user.types';

interface UserProfileProps {
  user: UserProfileType;
  isCurrentUser?: boolean;
  onEdit?: () => void;
  onFollow?: (userId: number) => void;
  onUnfollow?: (userId: number) => void;
  onMessage?: (userId: number) => void;
  onBlock?: (userId: number) => void;
  onReport?: (userId: number) => void;
  onAvatarUpload?: (file: File) => void;
  isLoading?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isCurrentUser = false,
  onEdit,
  onFollow,
  onUnfollow,
  onMessage,
  onBlock,
  onReport,
  onAvatarUpload,
  isLoading = false,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

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

  const handleBlockClick = () => {
    onBlock?.(user.id);
    handleMenuClose();
  };

  const handleReportClick = () => {
    onReport?.(user.id);
    handleMenuClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
          <UserAvatar
            src={user.profilePictureUrl}
            firstName={user.firstName}
            lastName={user.lastName}
            size={120}
            editable={isCurrentUser}
            onUpload={onAvatarUpload}
          />
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h4">
                {user.firstName} {user.lastName}
              </Typography>
              {user.isEmailVerified && (
                <Verified color="primary" />
              )}
              {user.isPrivate && (
                <Chip label="Private Account" size="small" variant="outlined" />
              )}
            </Box>
            
            <Typography variant="h6" color="textSecondary" gutterBottom>
              @{user.username}
            </Typography>
            
            {user.bio && (
              <Typography variant="body1" sx={{ mb: 2, maxWidth: 600 }}>
                {user.bio}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {user.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2" color="textSecondary">
                    {user.location}
                  </Typography>
                </Box>
              )}
              
              {user.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Language fontSize="small" color="action" />
                  <Link href={user.website} target="_blank" rel="noopener noreferrer">
                    <Typography variant="body2">
                      {user.website.replace(/^https?:\/\//, '')}
                    </Typography>
                  </Link>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarToday fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  Joined {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              <Typography variant="body2">
                <strong>{user.postCount}</strong> posts
              </Typography>
              <Typography variant="body2">
                <strong>{user.followerCount}</strong> followers
              </Typography>
              <Typography variant="body2">
                <strong>{user.followingCount}</strong> following
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {isCurrentUser ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={onEdit}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  {user.friendshipStatus !== FriendshipStatus.BLOCKED && (
                    <>
                      <Button
                        variant={user.isFollowing ? 'outlined' : 'contained'}
                        startIcon={user.isFollowing ? <PersonRemove /> : <PersonAdd />}
                        onClick={handleFollowClick}
                        disabled={isLoading}
                      >
                        {user.isFollowing ? 'Unfollow' : 'Follow'}
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<Message />}
                        onClick={handleMessageClick}
                      >
                        Message
                      </Button>
                    </>
                  )}
                  
                  <IconButton onClick={handleMenuOpen}>
                    <MoreVert />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
      
      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Posts" />
          <Tab label="Media" />
          <Tab label="About" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" color="textSecondary" align="center">
            Posts will be displayed here (Phase 6)
          </Typography>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1" color="textSecondary" align="center">
            Media posts will be displayed here (Phase 6)
          </Typography>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ maxWidth: 600 }}>
            {user.bio && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  About
                </Typography>
                <Typography variant="body1">
                  {user.bio}
                </Typography>
              </Box>
            )}
            
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" color="action" />
                <Typography variant="body2">
                  {user.email}
                </Typography>
              </Box>
              
              {user.phoneNumber && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">
                    {user.phoneNumber}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </TabPanel>
      </Paper>
      
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleBlockClick}>
          <ListItemIcon>
            <Block fontSize="small" />
          </ListItemIcon>
          <ListItemText>Block User</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleReportClick}>
          <ListItemIcon>
            <Report fontSize="small" />
          </ListItemIcon>
          <ListItemText>Report User</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}; 