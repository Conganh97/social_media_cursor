import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Search,
  PersonAdd,
  Person,
  MoreVert,
  People,
  Explore,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSocial } from '../hooks/useSocial';
import { User } from '@/modules/user/types/user.types';

interface UserCardProps {
  user: User;
  onSendRequest: (userId: number) => void;
  onViewProfile: (userId: number) => void;
  loading?: boolean;
  friendshipStatus?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onSendRequest,
  onViewProfile,
  loading = false,
  friendshipStatus = 'NONE'
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getActionButton = () => {
    switch (friendshipStatus) {
      case 'FRIENDS':
        return (
          <Chip
            label="Friends"
            color="success"
            variant="outlined"
            size="small"
          />
        );
      case 'PENDING_SENT':
        return (
          <Chip
            label="Request Sent"
            color="warning"
            variant="outlined"
            size="small"
          />
        );
      case 'PENDING_RECEIVED':
        return (
          <Chip
            label="Request Received"
            color="info"
            variant="outlined"
            size="small"
          />
        );
      default:
        return (
          <Button
            variant="outlined"
            size="small"
            startIcon={<PersonAdd />}
            onClick={() => onSendRequest(user.id)}
            disabled={loading}
          >
            Add Friend
          </Button>
        );
    }
  };

  return (
    <Card sx={{ height: '100%', '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <Avatar
            src={user.profilePictureUrl}
            sx={{ width: 80, height: 80, mb: 2, cursor: 'pointer' }}
            onClick={() => onViewProfile(user.id)}
          >
            {user.firstName[0]}{user.lastName[0]}
          </Avatar>

          <Typography
            variant="h6"
            gutterBottom
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => onViewProfile(user.id)}
          >
            {user.firstName} {user.lastName}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            @{user.username}
          </Typography>

          <Box display="flex" justifyContent="center" gap={1} mt={2}>
            {getActionButton()}
            
            <IconButton
              size="small"
              onClick={handleMenuClick}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onViewProfile(user.id); handleMenuClose(); }}>
          <Person sx={{ mr: 1 }} fontSize="small" />
          View Profile
        </MenuItem>
      </Menu>
    </Card>
  );
};

export const PeoplePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [suggestedPeople, setSuggestedPeople] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();
  const { friendship } = useSocial();

  // Mock data for suggested people (in real app, this would come from API)
  useEffect(() => {
    // Mock suggested people with complete User interface
    setSuggestedPeople([
      {
        id: 101,
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        profilePictureUrl: '',
        bio: 'Software developer',
        isEmailVerified: true,
        isPrivate: false,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      },
      {
        id: 102,
        username: 'jane_smith',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        profilePictureUrl: '',
        bio: 'Designer',
        isEmailVerified: true,
        isPrivate: false,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        createdAt: '2024-01-02',
        updatedAt: '2024-01-16'
      },
    ]);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      // For now, just filter suggested people as mock search
      const filtered = suggestedPeople.filter((user: User) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendFriendRequest = async (userId: number) => {
    setLoading(true);
    try {
      await friendship.sendFriendRequest({ targetUserId: userId });
      // Refresh suggestions or update local state
    } catch (error) {
      console.error('Failed to send friend request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  // Handle search on Enter key
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Discover People
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Search />} label="Search" iconPosition="start" />
          <Tab icon={<Explore />} label="Suggested" iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Box>
              <TextField
                fullWidth
                placeholder="Search for people by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchLoading && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!searchTerm.trim() || searchLoading}
                sx={{ mb: 3 }}
              >
                Search
              </Button>

              {searchResults.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Search Results ({searchResults.length})
                  </Typography>
                  <Grid container spacing={3}>
                    {searchResults.map((user) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                        <UserCard
                          user={user}
                          onSendRequest={handleSendFriendRequest}
                          onViewProfile={handleViewProfile}
                          loading={loading}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {searchTerm && searchResults.length === 0 && !searchLoading && (
                <Box textAlign="center" py={4}>
                  <People sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No people found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try searching with different keywords
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                People You May Know
              </Typography>
              
              {suggestedPeople.length > 0 ? (
                <Grid container spacing={3}>
                  {suggestedPeople.map((user) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                      <UserCard
                        user={user}
                        onSendRequest={handleSendFriendRequest}
                        onViewProfile={handleViewProfile}
                        loading={loading}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={4}>
                  <Explore sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No suggestions available
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check back later for new people to connect with
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}; 