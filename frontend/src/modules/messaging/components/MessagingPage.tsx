import React, { useCallback } from 'react';
import {
  Container,
  Paper,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useMessages } from '../hooks/useMessages';
import { ConversationFilters } from '../types/message.types';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

const MessagingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    conversations,
    messages,
    activeConversationId,
    typingIndicators,
    currentUserId,
    loading,
    sendMessage,
    selectConversation,
    loadMoreMessages,
    startTyping,
    stopTyping,
    hasMoreMessages,
    searchConversations,
    loadConversations
  } = useMessages();

  const activeConversation = Array.isArray(conversations) ? conversations.find(c => c.id === activeConversationId) : undefined;
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const activeTypingIndicators = activeConversationId ? typingIndicators[activeConversationId] || [] : [];

  const handleConversationSelect = useCallback((conversationId: string) => {
    selectConversation(conversationId);
  }, [selectConversation]);

  const handleSendMessage = useCallback((content: string, attachments?: File[]) => {
    if (activeConversationId) {
      sendMessage({
        conversationId: activeConversationId,
        content,
        attachments
      });
    }
  }, [activeConversationId, sendMessage]);

  const handleLoadMoreMessages = useCallback(() => {
    if (activeConversationId) {
      loadMoreMessages(activeConversationId);
    }
  }, [activeConversationId, loadMoreMessages]);

  const handleTypingStart = useCallback(() => {
    if (activeConversationId) {
      startTyping(activeConversationId);
    }
  }, [activeConversationId, startTyping]);

  const handleTypingStop = useCallback(() => {
    if (activeConversationId) {
      stopTyping(activeConversationId);
    }
  }, [activeConversationId, stopTyping]);

  const handleSearch = useCallback((filters: ConversationFilters) => {
    if (filters.search) {
      searchConversations(filters.search);
    } else {
      loadConversations(filters);
    }
  }, [searchConversations, loadConversations]);

  if (isMobile) {
    return (
      <Container maxWidth="xl" sx={{ p: 0, height: '100vh' }}>
        <Paper sx={{ height: '100%', display: 'flex', borderRadius: 0 }}>
          {!activeConversationId ? (
            <ConversationList
              conversations={conversations}
              selectedConversationId={activeConversationId}
              onConversationSelect={handleConversationSelect}
              onSearch={handleSearch}
              loading={loading}
              currentUserId={currentUserId}
            />
          ) : (
            <ChatWindow
              conversation={activeConversation || null}
              messages={activeMessages}
              typingIndicators={activeTypingIndicators}
              currentUserId={currentUserId}
              loading={loading}
              onSendMessage={handleSendMessage}
              onLoadMoreMessages={handleLoadMoreMessages}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              hasMoreMessages={hasMoreMessages[activeConversationId] || false}
            />
          )}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
      <Paper sx={{ height: 'calc(100vh - 120px)', display: 'flex' }}>
        <Box sx={{ width: 350, borderRight: 1, borderColor: 'divider' }}>
          <ConversationList
            conversations={conversations}
            selectedConversationId={activeConversationId}
            onConversationSelect={handleConversationSelect}
            onSearch={handleSearch}
            loading={loading}
            currentUserId={currentUserId}
          />
        </Box>

        <Box sx={{ flex: 1 }}>
          <ChatWindow
            conversation={activeConversation || null}
            messages={activeMessages}
            typingIndicators={activeTypingIndicators}
            currentUserId={currentUserId}
            loading={loading}
            onSendMessage={handleSendMessage}
            onLoadMoreMessages={handleLoadMoreMessages}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
            hasMoreMessages={hasMoreMessages[activeConversationId || ''] || false}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default MessagingPage; 