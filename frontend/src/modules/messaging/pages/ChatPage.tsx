import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useMessages } from '../hooks/useMessages';
import ChatWindow from '../components/ChatWindow';

const ChatPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const {
    conversations,
    messages,
    typingIndicators,
    currentUserId,
    loading,
    sendMessage,
    loadMoreMessages,
    startTyping,
    stopTyping,
    hasMoreMessages
  } = useMessages();

  const conversation = conversations.find(c => c.id === conversationId);
  const conversationMessages = conversationId ? messages[conversationId] || [] : [];
  const conversationTypingIndicators = conversationId ? typingIndicators[conversationId] || [] : [];

  useEffect(() => {
    if (!conversationId) {
      navigate('/messages');
    }
  }, [conversationId, navigate]);

  const handleSendMessage = (content: string, attachments?: File[]) => {
    if (conversationId) {
      sendMessage({
        conversationId,
        content,
        attachments
      });
    }
  };

  const handleLoadMoreMessages = () => {
    if (conversationId) {
      loadMoreMessages(conversationId);
    }
  };

  const handleTypingStart = () => {
    if (conversationId) {
      startTyping(conversationId);
    }
  };

  const handleTypingStop = () => {
    if (conversationId) {
      stopTyping(conversationId);
    }
  };

  const getConversationName = () => {
    if (!conversation) return 'Chat';
    
    if (conversation.isGroup) {
      return conversation.groupName || 'Group Chat';
    }
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    return otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown User';
  };

  const getConversationAvatar = () => {
    if (!conversation) return '';
    
    if (conversation.isGroup) {
      return conversation.groupAvatar || '';
    }
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    return otherParticipant?.profilePictureUrl || '';
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Mobile App Bar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => navigate('/messages')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Avatar
            src={getConversationAvatar()}
            sx={{ width: 32, height: 32, mr: 2 }}
          >
            {getConversationName().charAt(0)}
          </Avatar>
          
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {getConversationName()}
          </Typography>
          
          <IconButton edge="end">
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Chat Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <ChatWindow
          conversation={conversation || null}
          messages={conversationMessages}
          typingIndicators={conversationTypingIndicators}
          currentUserId={currentUserId}
          loading={loading}
          onSendMessage={handleSendMessage}
          onLoadMoreMessages={handleLoadMoreMessages}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
          hasMoreMessages={hasMoreMessages[conversationId || ''] || false}
        />
      </Box>
    </Box>
  );
};

export default ChatPage; 