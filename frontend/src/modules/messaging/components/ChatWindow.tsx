import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon
} from '@mui/icons-material';
import { Conversation, Message, TypingIndicator } from '../types/message.types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import OnlineStatus from './OnlineStatus';

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  typingIndicators: TypingIndicator[];
  currentUserId: string;
  loading?: boolean;
  onSendMessage: (content: string, attachments?: File[]) => void;
  onLoadMoreMessages?: () => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  hasMoreMessages?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  typingIndicators,
  currentUserId,
  loading = false,
  onSendMessage,
  onLoadMoreMessages,
  onTypingStart,
  onTypingStop,
  hasMoreMessages = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current || !hasMoreMessages || loading) return;

    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop === 0) {
      onLoadMoreMessages?.();
    }
  };

  const getConversationName = () => {
    if (!conversation) return '';
    
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

  const getOtherParticipant = () => {
    if (!conversation || conversation.isGroup) return null;
    return conversation.participants.find(p => p.id !== currentUserId);
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  if (!conversation) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          bgcolor: 'background.default'
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Select a conversation to start messaging
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose from your existing conversations or start a new one
        </Typography>
      </Box>
    );
  }

  const otherParticipant = getOtherParticipant();
  const messageGroups = groupMessagesByDate(messages);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={getConversationAvatar()} 
              sx={{ mr: 2, width: 40, height: 40 }}
            >
              {getConversationName().charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                {getConversationName()}
              </Typography>
              {otherParticipant && (
                <OnlineStatus 
                  isOnline={otherParticipant.isOnline} 
                  lastSeen={otherParticipant.lastSeen}
                />
              )}
              {conversation.isGroup && (
                <Typography variant="body2" color="text.secondary">
                  {conversation.participants.length} members
                </Typography>
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" sx={{ mr: 1 }}>
              <PhoneIcon />
            </IconButton>
            <IconButton size="small" sx={{ mr: 1 }}>
              <VideoCallIcon />
            </IconButton>
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 1,
          bgcolor: 'grey.50'
        }}
      >
        {loading && hasMoreMessages && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {Object.entries(messageGroups).map(([dateString, dateMessages]) => (
          <Box key={dateString}>
            {/* Date Header */}
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  bgcolor: 'background.paper',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  color: 'text.secondary',
                  border: 1,
                  borderColor: 'divider'
                }}
              >
                {formatDateHeader(dateString)}
              </Typography>
            </Box>

            {/* Messages for this date */}
            {dateMessages.map((message, index) => {
              const prevMessage = index > 0 ? dateMessages[index - 1] : null;
              const nextMessage = index < dateMessages.length - 1 ? dateMessages[index + 1] : null;
              
              const isFirstInGroup = !prevMessage || prevMessage.senderId !== message.senderId;
              const isLastInGroup = !nextMessage || nextMessage.senderId !== message.senderId;
              
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUserId}
                  isFirstInGroup={isFirstInGroup}
                  isLastInGroup={isLastInGroup}
                  conversation={conversation}
                />
              );
            })}
          </Box>
        ))}

        {/* Typing Indicators */}
        {typingIndicators.length > 0 && (
          <Box sx={{ px: 2, py: 1 }}>
            {typingIndicators.map((indicator) => (
              <Typography
                key={indicator.userId}
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                {indicator.username} is typing...
              </Typography>
            ))}
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
        disabled={!conversation}
      />
    </Box>
  );
};

export default ChatWindow; 