import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { UserSearch } from '../components/UserSearch';
import { UserCard } from '../components/UserCard';
import { useUser } from '../hooks/useUser';

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

export const UserListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(0);
  
  const { followUser, unfollowUser } = useUser();
  
  const listType = searchParams.get('type') || 'search';
  const userId = searchParams.get('userId');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUserSelect = (selectedUserId: number) => {
    navigate(`/profile/${selectedUserId}`);
  };

  const handleUserMessage = (selectedUserId: number) => {
    navigate(`/messages?user=${selectedUserId}`);
  };

  const handleUserFollow = (selectedUserId: number) => {
    followUser(selectedUserId);
  };

  const handleUserUnfollow = (selectedUserId: number) => {
    unfollowUser(selectedUserId);
  };

  const getPageTitle = () => {
    switch (listType) {
      case 'followers':
        return 'Followers';
      case 'following':
        return 'Following';
      case 'search':
      default:
        return 'Find People';
    }
  };

  const renderContent = () => {
    switch (listType) {
      case 'followers':
        return (
          <Typography variant="body1" color="textSecondary" align="center">
            Followers list will be implemented in a future update
          </Typography>
        );
      case 'following':
        return (
          <Typography variant="body1" color="textSecondary" align="center">
            Following list will be implemented in a future update
          </Typography>
        );
      case 'search':
      default:
        return (
          <UserSearch
            onUserSelect={handleUserSelect}
            onUserMessage={handleUserMessage}
            onUserFollow={handleUserFollow}
            onUserUnfollow={handleUserUnfollow}
            placeholder="Search for people..."
            autoFocus
          />
        );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {getPageTitle()}
      </Typography>

      {listType === 'search' ? (
        <Paper sx={{ p: 3 }}>
          {renderContent()}
        </Paper>
      ) : (
        <>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab label="All" />
            <Tab label="Mutual Friends" />
            <Tab label="Suggested" />
          </Tabs>

          <Paper sx={{ p: 3 }}>
            <TabPanel value={tabValue} index={0}>
              {renderContent()}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Typography variant="body1" color="textSecondary" align="center">
                Mutual friends will be shown here
              </Typography>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Typography variant="body1" color="textSecondary" align="center">
                Suggested people will be shown here
              </Typography>
            </TabPanel>
          </Paper>
        </>
      )}
    </Container>
  );
}; 