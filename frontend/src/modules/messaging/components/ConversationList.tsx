import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Typography,
  Badge,
  Chip,
  InputAdornment,
  ListItemButton,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { Conversation, ConversationFilters } from '../types/message.types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onSearch?: (filters: ConversationFilters) => void;
  loading?: boolean;
  currentUserId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onConversationSelect,
  onSearch,
  loading = false,
  currentUserId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use ref to store the latest onSearch function to avoid dependency cycles
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  // Defensive check to ensure conversations is always an array
  const safeConversations = Array.isArray(conversations) ? conversations : [];

  useEffect(() => {
    // Only trigger search if searchQuery actually changed
    const delayedSearch = setTimeout(() => {
      const searchFilters: ConversationFilters = {
        search: searchQuery || undefined
      };
      // Use ref to avoid dependency on onSearch
      onSearchRef.current?.(searchFilters);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]); // Only depend on searchQuery to prevent infinite loops

  const formatLastMessageTime = (timestamp: Date) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1d' : `${diffInDays}d`;
    }
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.groupName || 'Group Chat';
    }
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    return otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown User';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.groupAvatar || '';
    }
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    return otherParticipant?.profilePictureUrl || '';
  };

  const isUserOnline = (conversation: Conversation) => {
    if (conversation.isGroup) return false;
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    return otherParticipant?.isOnline || false;
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>Loading conversations...</Typography>
      </Box>
    );
  }

  if (!Array.isArray(conversations) || conversations.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <TextField
          fullWidth
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="textSecondary" textAlign="center">
          {!Array.isArray(conversations) ? 'Error loading conversations' : 'No conversations found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Messages
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            )
          }}
          sx={{ mb: 1 }}
        />
      </Box>

      <Divider />

      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {safeConversations.map((conversation) => (
          <ListItem key={conversation.id} disablePadding>
            <ListItemButton
              selected={selectedConversationId === conversation.id}
              onClick={() => onConversationSelect(conversation.id)}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' },
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  '&:hover': { bgcolor: 'primary.light' }
                }
              }}
            >
              <ListItemAvatar>
                <Badge
                  color="success"
                  variant="dot"
                  invisible={!isUserOnline(conversation)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                  <Avatar src={getConversationAvatar(conversation)}>
                    {conversation.isGroup ? (
                      <GroupIcon />
                    ) : (
                      getConversationName(conversation).charAt(0)
                    )}
                  </Avatar>
                </Badge>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography 
                      variant="subtitle2" 
                      noWrap
                      sx={{ 
                        fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                        maxWidth: '70%'
                      }}
                    >
                      {getConversationName(conversation)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {conversation.lastMessage && (
                        <Typography variant="caption" color="text.secondary">
                          {formatLastMessageTime(conversation.lastMessage.timestamp)}
                        </Typography>
                      )}
                      {conversation.unreadCount > 0 && (
                        <Chip
                          label={conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          size="small"
                          color="primary"
                          sx={{ 
                            minWidth: 20, 
                            height: 20,
                            '& .MuiChip-label': {
                              fontSize: '0.75rem',
                              px: 0.5
                            }
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                }
                secondary={
                  conversation.lastMessage && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ 
                        fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                        opacity: conversation.unreadCount > 0 ? 1 : 0.7
                      }}
                    >
                      {conversation.lastMessage.content}
                    </Typography>
                  )
                }
              />
            </ListItemButton>
          </ListItem>
        ))}

        {safeConversations.length === 0 && !loading && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: 'text.secondary'
            }}
          >
            <Typography variant="h6" gutterBottom>
              No conversations yet
            </Typography>
            <Typography variant="body2">
              Start a new conversation to begin messaging
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default ConversationList; 