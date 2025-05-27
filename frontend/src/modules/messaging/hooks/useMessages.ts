import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  fetchConversations,
  fetchMessages,
  sendMessage as sendMessageAction,
  setActiveConversation,
  markMessagesAsRead,
  createConversation
} from '../store/messageSlice';
import { messageWebSocketService } from '../services/messageWebSocket';
import { 
  CreateMessageData, 
  CreateConversationData, 
  ConversationFilters,
  Conversation,
  Message,
  TypingIndicator
} from '../types/message.types';

export const useMessages = () => {
  const dispatch = useAppDispatch();
  const {
    conversations,
    messages,
    activeConversationId,
    typingIndicators,
    onlineUsers,
    loading,
    error,
    hasMoreMessages,
    messageLoading
  } = useAppSelector(state => state.messages);
  
  const { user } = useAppSelector(state => state.auth);
  const currentUserId = user?.id?.toString() || '';
  
  // Track if initial load has been done
  const hasInitialLoadRef = useRef(false);

  const connectWebSocket = useCallback(async () => {
    try {
      await messageWebSocketService.connect();
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, []);

  const loadConversations = useCallback((filters?: ConversationFilters) => {
    dispatch(fetchConversations(filters));
  }, [dispatch]);

  useEffect(() => {
    if (currentUserId && !hasInitialLoadRef.current) {
      hasInitialLoadRef.current = true;
      loadConversations();
      connectWebSocket();
    }

    return () => {
      if (!currentUserId) {
        hasInitialLoadRef.current = false;
        messageWebSocketService.disconnect();
      }
    };
  }, [currentUserId, loadConversations, connectWebSocket]);

  const loadMessages = useCallback((conversationId: string, page: number = 0) => {
    dispatch(fetchMessages({ conversationId, page }));
  }, [dispatch]);

  const loadMoreMessages = useCallback((conversationId: string) => {
    const currentMessages = messages[conversationId] || [];
    const page = Math.floor(currentMessages.length / 20);
    loadMessages(conversationId, page);
  }, [messages, loadMessages]);

  const sendMessage = useCallback((messageData: CreateMessageData) => {
    dispatch(sendMessageAction(messageData));
  }, [dispatch]);

  const selectConversation = useCallback((conversationId: string) => {
    dispatch(setActiveConversation(conversationId));
    
    if (!messages[conversationId]) {
      loadMessages(conversationId);
    }
    
    messageWebSocketService.joinConversation(conversationId);
    
    dispatch(markMessagesAsRead(conversationId));
  }, [dispatch, messages, loadMessages]);

  const createNewConversation = useCallback((conversationData: CreateConversationData) => {
    dispatch(createConversation(conversationData));
  }, [dispatch]);

  const startTyping = useCallback((conversationId: string) => {
    messageWebSocketService.sendTypingIndicator(conversationId, true);
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    messageWebSocketService.sendTypingIndicator(conversationId, false);
  }, []);

  const searchConversations = useCallback((query: string) => {
    loadConversations({ search: query });
  }, [loadConversations]);

  const getConversation = useCallback((conversationId: string): Conversation | undefined => {
    return Array.isArray(conversations) ? conversations.find(c => c.id === conversationId) : undefined;
  }, [conversations]);

  const getConversationMessages = useCallback((conversationId: string): Message[] => {
    return messages[conversationId] || [];
  }, [messages]);

  const getTypingIndicators = useCallback((conversationId: string): TypingIndicator[] => {
    return typingIndicators[conversationId] || [];
  }, [typingIndicators]);

  const isUserOnline = useCallback((userId: string): boolean => {
    return onlineUsers[userId] || false;
  }, [onlineUsers]);

  const getUnreadCount = useCallback((): number => {
    return Array.isArray(conversations) ? conversations.reduce((total, conversation) => total + conversation.unreadCount, 0) : 0;
  }, [conversations]);

  const isConversationLoading = useCallback((conversationId: string): boolean => {
    return messageLoading[conversationId] || false;
  }, [messageLoading]);

  const hasMoreMessagesForConversation = useCallback((conversationId: string): boolean => {
    return hasMoreMessages[conversationId] || false;
  }, [hasMoreMessages]);

  return {
    // State
    conversations,
    messages,
    activeConversationId,
    typingIndicators,
    onlineUsers,
    loading,
    error,
    hasMoreMessages,
    currentUserId,
    
    // Actions
    loadConversations,
    loadMessages,
    loadMoreMessages,
    sendMessage,
    selectConversation,
    createNewConversation,
    startTyping,
    stopTyping,
    searchConversations,
    
    // Getters
    getConversation,
    getConversationMessages,
    getTypingIndicators,
    isUserOnline,
    getUnreadCount,
    isConversationLoading,
    hasMoreMessagesForConversation,
    
    // WebSocket
    connectWebSocket,
    isWebSocketConnected: messageWebSocketService.isWebSocketConnected()
  };
}; 