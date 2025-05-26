import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Button,
  Menu,
  MenuItem,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Message,
  Person,
  PersonRemove,
} from '@mui/icons-material';
import { User } from '@/modules/user/types/user.types';

interface FriendsListProps {
  friends: User[];
  loading?: boolean;
  onMessageClick?: (friend: User) => void;
  onViewProfile?: (friend: User) => void;
  onUnfriend?: (friend: User) => void;
  showSearch?: boolean;
  emptyMessage?: string;
}

export const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  loading = false,
  onMessageClick,
  onViewProfile,
  onUnfriend,
  showSearch = true,
  emptyMessage = "No friends found"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFriends, setFilteredFriends] = useState<User[]>(friends);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter(friend =>
        friend.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [friends, searchTerm]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, friend: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedFriend(friend);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFriend(null);
  };

  const handleAction = (action: string) => {
    if (!selectedFriend) return;

    switch (action) {
      case 'message':
        onMessageClick?.(selectedFriend);
        break;
      case 'profile':
        onViewProfile?.(selectedFriend);
        break;
      case 'unfriend':
        onUnfriend?.(selectedFriend);
        break;
    }
    handleMenuClose();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `Active ${diffInHours}h ago`;
    return `Active ${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {showSearch && (
        <TextField
          fullWidth
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      )}

      {filteredFriends.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? 'No friends match your search' : emptyMessage}
          </Typography>
          {searchTerm && (
            <Typography variant="body2" color="text.secondary">
              Try searching with a different term
            </Typography>
          )}
        </Box>
      ) : (
        <List>
          {filteredFriends.map((friend, index) => (
            <React.Fragment key={friend.id}>
              <ListItem
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderRadius: 1,
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={friend.profilePictureUrl}
                    sx={{ width: 56, height: 56, cursor: 'pointer' }}
                    onClick={() => onViewProfile?.(friend)}
                  >
                    {friend.firstName[0]}{friend.lastName[0]}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="subtitle1"
                        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        onClick={() => onViewProfile?.(friend)}
                      >
                        {friend.firstName} {friend.lastName}
                      </Typography>
                      <Chip
                        label="Friend"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        @{friend.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(friend.updatedAt || friend.createdAt || new Date().toISOString())}
                      </Typography>
                    </Box>
                  }
                />

                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Message />}
                    onClick={() => onMessageClick?.(friend)}
                  >
                    Message
                  </Button>
                  
                  <IconButton
                    onClick={(e) => handleMenuClick(e, friend)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
              </ListItem>
              
              {index < filteredFriends.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('profile')}>
          <Person sx={{ mr: 1 }} fontSize="small" />
          View Profile
        </MenuItem>
        <MenuItem onClick={() => handleAction('message')}>
          <Message sx={{ mr: 1 }} fontSize="small" />
          Send Message
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction('unfriend')} sx={{ color: 'error.main' }}>
          <PersonRemove sx={{ mr: 1 }} fontSize="small" />
          Unfriend
        </MenuItem>
      </Menu>
    </Box>
  );
}; 