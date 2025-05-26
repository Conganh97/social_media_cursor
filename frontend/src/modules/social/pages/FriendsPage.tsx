import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Badge,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PersonAdd,
  People,
  PersonAddAlt1,
  Explore,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSocial } from '../hooks/useSocial';
import { FriendsList } from '../components/FriendsList';
import { FriendRequestCard } from '../components/FriendRequestCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`friends-tabpanel-${index}`}
      aria-labelledby={`friends-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export const FriendsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    friends,
    friendRequests,
    sentRequests,
    loading,
    friendship,
    friendCount,
  } = useSocial();

  useEffect(() => {
    // Fetch initial data
    friendship.fetchFriends();
    friendship.fetchFriendRequests();
    friendship.fetchSentRequests();
    friendship.fetchFriendCount();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMessageClick = (friend: any) => {
    navigate(`/messages/${friend.id}`);
  };

  const handleViewProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await friendship.acceptFriendRequest(requestId);
      // Refresh data
      friendship.fetchFriends();
      friendship.fetchFriendRequests();
      friendship.fetchFriendCount();
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await friendship.rejectFriendRequest(requestId);
      // Refresh requests
      friendship.fetchFriendRequests();
    } catch (error) {
      console.error('Failed to reject friend request:', error);
    }
  };

  const handleUnfriend = async (friend: any) => {
    // TODO: Implement unfriend functionality
    console.log('Unfriend:', friend);
  };

  const handleFindFriends = () => {
    navigate('/people');
  };

  const pendingRequestsCount = friendRequests.filter(req => req.status === 'PENDING').length;
  const sentRequestsCount = sentRequests.filter(req => req.status === 'PENDING').length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Friends {friendCount > 0 && `(${friendCount})`}
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<People />} 
            label="My Friends" 
            iconPosition="start"
          />
          <Tab 
            icon={
              <Badge badgeContent={pendingRequestsCount} color="error">
                <PersonAddAlt1 />
              </Badge>
            } 
            label="Requests" 
            iconPosition="start"
          />
          <Tab 
            icon={
              <Badge badgeContent={sentRequestsCount} color="warning">
                <PersonAdd />
              </Badge>
            } 
            label="Sent" 
            iconPosition="start"
          />
          <Tab 
            icon={<Explore />} 
            label="Discover" 
            iconPosition="start"
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <FriendsList
              friends={friends}
              loading={loading}
              onMessageClick={handleMessageClick}
              onViewProfile={(friend) => handleViewProfile(friend.id)}
              onUnfriend={handleUnfriend}
              emptyMessage="You haven't added any friends yet. Start discovering people!"
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Friend Requests {pendingRequestsCount > 0 && `(${pendingRequestsCount})`}
              </Typography>
              
              {friendRequests.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <PersonAddAlt1 sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No friend requests
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    When someone sends you a friend request, it will appear here
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {friendRequests.map((request) => (
                    <FriendRequestCard
                      key={request.id}
                      request={request}
                      type="received"
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                      onViewProfile={handleViewProfile}
                      loading={loading}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Sent Requests {sentRequestsCount > 0 && `(${sentRequestsCount})`}
              </Typography>
              
              {sentRequests.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <PersonAdd sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No sent requests
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Friend requests you send will appear here
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {sentRequests.map((request) => (
                    <FriendRequestCard
                      key={request.id}
                      request={request}
                      type="sent"
                      onCancel={handleRejectRequest}
                      onViewProfile={handleViewProfile}
                      loading={loading}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box textAlign="center" py={4}>
              <Explore sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Discover People
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Find and connect with new people
              </Typography>
              <Fab
                variant="extended"
                color="primary"
                onClick={handleFindFriends}
              >
                <PersonAdd sx={{ mr: 1 }} />
                Find Friends
              </Fab>
            </Box>
          </TabPanel>
        </Box>
      </Paper>

      {/* Floating Action Button for mobile */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={handleFindFriends}
        >
          <PersonAdd />
        </Fab>
      )}
    </Container>
  );
}; 