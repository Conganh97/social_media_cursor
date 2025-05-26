import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { messageApi } from '../services/messageApi';
import { 
  MessageState, 
  Conversation, 
  Message, 
  CreateMessageData, 
  UpdateMessageData,
  CreateConversationData,
  TypingIndicator,
  ConversationFilters
} from '../types/message.types';

const initialState: MessageState = {
  conversations: [],
  messages: {},
  activeConversationId: null,
  typingIndicators: {},
  onlineUsers: {},
  loading: false,
  error: null,
  hasMoreMessages: {},
  messageLoading: {}
};

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (filters?: ConversationFilters) => {
    const response = await messageApi.getConversations(filters);
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ conversationId, page = 0, size = 20 }: { conversationId: string; page?: number; size?: number }) => {
    const response = await messageApi.getMessages(conversationId, page, size);
    return { conversationId, ...response.data };
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData: CreateMessageData) => {
    const response = await messageApi.sendMessage(messageData);
    return response.data;
  }
);

export const updateMessage = createAsyncThunk(
  'messages/updateMessage',
  async ({ messageId, data }: { messageId: string; data: UpdateMessageData }) => {
    const response = await messageApi.updateMessage(messageId, data);
    return response.data;
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (messageId: string) => {
    await messageApi.deleteMessage(messageId);
    return messageId;
  }
);

export const createConversation = createAsyncThunk(
  'messages/createConversation',
  async (conversationData: CreateConversationData) => {
    const response = await messageApi.createConversation(conversationData);
    return response.data;
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'messages/markMessagesAsRead',
  async (conversationId: string) => {
    await messageApi.markMessagesAsRead(conversationId);
    return conversationId;
  }
);

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const conversationId = message.conversationId;
      
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      
      const existingIndex = state.messages[conversationId].findIndex(m => m.id === message.id);
      if (existingIndex === -1) {
        state.messages[conversationId].push(message);
        state.messages[conversationId].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      }
      
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessage = message;
        conversation.updatedAt = message.timestamp;
        if (message.senderId !== state.activeConversationId) {
          conversation.unreadCount += 1;
        }
      }
    },
    
    updateMessageInState: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const conversationId = message.conversationId;
      
      if (state.messages[conversationId]) {
        const index = state.messages[conversationId].findIndex(m => m.id === message.id);
        if (index !== -1) {
          state.messages[conversationId][index] = message;
        }
      }
    },
    
    removeMessage: (state, action: PayloadAction<{ messageId: string; conversationId: string }>) => {
      const { messageId, conversationId } = action.payload;
      
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].filter(m => m.id !== messageId);
      }
    },
    
    addConversation: (state, action: PayloadAction<Conversation>) => {
      const conversation = action.payload;
      const existingIndex = state.conversations.findIndex(c => c.id === conversation.id);
      
      if (existingIndex === -1) {
        state.conversations.unshift(conversation);
      } else {
        state.conversations[existingIndex] = conversation;
      }
    },
    
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const conversation = action.payload;
      const index = state.conversations.findIndex(c => c.id === conversation.id);
      
      if (index !== -1) {
        state.conversations[index] = conversation;
      }
    },
    
    setTypingIndicator: (state, action: PayloadAction<TypingIndicator>) => {
      const indicator = action.payload;
      const conversationId = indicator.conversationId;
      
      if (!state.typingIndicators[conversationId]) {
        state.typingIndicators[conversationId] = [];
      }
      
      const existingIndex = state.typingIndicators[conversationId].findIndex(
        t => t.userId === indicator.userId
      );
      
      if (indicator.isTyping) {
        if (existingIndex === -1) {
          state.typingIndicators[conversationId].push(indicator);
        } else {
          state.typingIndicators[conversationId][existingIndex] = indicator;
        }
      } else {
        if (existingIndex !== -1) {
          state.typingIndicators[conversationId].splice(existingIndex, 1);
        }
      }
    },
    
    setUserOnlineStatus: (state, action: PayloadAction<{ userId: string; isOnline: boolean }>) => {
      const { userId, isOnline } = action.payload;
      state.onlineUsers[userId] = isOnline;
      
      state.conversations.forEach(conversation => {
        const participant = conversation.participants.find(p => p.id === userId);
        if (participant) {
          participant.isOnline = isOnline;
          if (!isOnline) {
            participant.lastSeen = new Date();
          }
        }
      });
    },
    
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        conversation.unreadCount = 0;
      }
      
      if (state.messages[conversationId]) {
        state.messages[conversationId].forEach(message => {
          message.isRead = true;
        });
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setMessageLoading: (state, action: PayloadAction<{ conversationId: string; loading: boolean }>) => {
      const { conversationId, loading } = action.payload;
      state.messageLoading[conversationId] = loading;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearMessages: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      delete state.messages[conversationId];
      delete state.hasMoreMessages[conversationId];
      delete state.messageLoading[conversationId];
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload || [];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch conversations';
      })
      
      .addCase(fetchMessages.pending, (state, action) => {
        const conversationId = action.meta.arg.conversationId;
        state.messageLoading[conversationId] = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages, hasMore } = action.payload;
        state.messageLoading[conversationId] = false;
        
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        
        const existingMessages = state.messages[conversationId];
        const messageList = messages || [];
        const newMessages = messageList.filter(
          (newMsg: Message) => !existingMessages.some(existing => existing.id === newMsg.id)
        );
        
        state.messages[conversationId] = [...newMessages, ...existingMessages];
        state.hasMoreMessages[conversationId] = hasMore || false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        const conversationId = action.meta.arg.conversationId;
        state.messageLoading[conversationId] = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })
      
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        if (message) {
          messageSlice.caseReducers.addMessage(state, { payload: message, type: 'addMessage' });
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to send message';
      })
      
      .addCase(updateMessage.fulfilled, (state, action) => {
        const message = action.payload;
        if (message) {
          messageSlice.caseReducers.updateMessageInState(state, { payload: message, type: 'updateMessage' });
        }
      })
      
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const messageId = action.payload;
        Object.keys(state.messages).forEach(conversationId => {
          state.messages[conversationId] = state.messages[conversationId].filter(m => m.id !== messageId);
        });
      })
      
      .addCase(createConversation.fulfilled, (state, action) => {
        const conversation = action.payload;
        if (conversation) {
          messageSlice.caseReducers.addConversation(state, { payload: conversation, type: 'addConversation' });
        }
      })
      
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const conversationId = action.payload;
        messageSlice.caseReducers.markConversationAsRead(state, { payload: conversationId, type: 'markConversationAsRead' });
      });
  }
});

export const {
  setActiveConversation,
  addMessage,
  updateMessageInState,
  removeMessage,
  addConversation,
  updateConversation,
  setTypingIndicator,
  setUserOnlineStatus,
  markConversationAsRead,
  setLoading,
  setMessageLoading,
  setError,
  clearError,
  clearMessages
} = messageSlice.actions;

export default messageSlice.reducer; 