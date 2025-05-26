import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  Divider
} from '@mui/material';
import {
  Settings as SettingsIcon,
  ViewList as ListIcon,
  ViewModule as GroupIcon
} from '@mui/icons-material';
import { NotificationList } from '../components/NotificationList';
import { NotificationSettings } from '../types/notification.types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const NotificationsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showGrouped, setShowGrouped] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    likes: true,
    comments: true,
    friendRequests: true,
    messages: true,
    mentions: true,
    systemUpdates: true
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSettingsChange = (key: keyof NotificationSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: event.target.checked
    }));
  };

  const handleSaveSettings = () => {
    setSettingsOpen(false);
  };

  const handleNotificationClick = (notificationId: string) => {
    console.log('Notification clicked:', notificationId);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper elevation={1} sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showGrouped}
                    onChange={(e) => setShowGrouped(e.target.checked)}
                    icon={<ListIcon />}
                    checkedIcon={<GroupIcon />}
                  />
                }
                label={showGrouped ? 'Grouped' : 'List'}
              />
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => setSettingsOpen(true)}
              >
                Settings
              </Button>
            </Box>
          </Box>

          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All" />
            <Tab label="Unread" />
            <Tab label="Mentions" />
            <Tab label="Friend Requests" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <NotificationList
            showGrouped={showGrouped}
            onNotificationClick={handleNotificationClick}
            maxHeight="calc(100vh - 300px)"
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <NotificationList
            showGrouped={showGrouped}
            onNotificationClick={handleNotificationClick}
            maxHeight="calc(100vh - 300px)"
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <NotificationList
            showGrouped={showGrouped}
            onNotificationClick={handleNotificationClick}
            maxHeight="calc(100vh - 300px)"
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <NotificationList
            showGrouped={showGrouped}
            onNotificationClick={handleNotificationClick}
            maxHeight="calc(100vh - 300px)"
          />
        </TabPanel>
      </Paper>

      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notification Settings</DialogTitle>
        <DialogContent>
          <FormGroup>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              General Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleSettingsChange('emailNotifications')}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={handleSettingsChange('pushNotifications')}
                />
              }
              label="Push Notifications"
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Notification Types
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.likes}
                  onChange={handleSettingsChange('likes')}
                />
              }
              label="Likes on your posts"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.comments}
                  onChange={handleSettingsChange('comments')}
                />
              }
              label="Comments on your posts"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.friendRequests}
                  onChange={handleSettingsChange('friendRequests')}
                />
              }
              label="Friend requests"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.messages}
                  onChange={handleSettingsChange('messages')}
                />
              }
              label="New messages"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.mentions}
                  onChange={handleSettingsChange('mentions')}
                />
              }
              label="Mentions in posts and comments"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.systemUpdates}
                  onChange={handleSettingsChange('systemUpdates')}
                />
              }
              label="System updates"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveSettings} variant="contained">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}; 