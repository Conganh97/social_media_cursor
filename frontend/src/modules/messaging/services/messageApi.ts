import { apiService } from '@/shared/services';
import { httpClient } from '@/shared/services/httpClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { 
  Conversation, 
  Message, 
  UpdateMessageData,
  CreateConversationData,
  PaginatedMessages,
  ConversationFilters,
  MessageType
} from '../types/message.types';

// Updated message types to match backend
export interface MessageRequest {
  receiverId: number;
  content: string;
}

export interface MessageResponse {
  id: number;
  content: string;
  sender: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  receiver: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  readStatus: boolean;
  createdAt: string;
}

export interface ConversationResponse {
  otherUser: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  lastMessage: MessageResponse;
  unreadCount: number;
  lastActivity: string;
}

export const messageApi = {
  getConversations: async (filters?: ConversationFilters) => {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.unreadOnly) params.append('unreadOnly', 'true');
      if (filters?.groupsOnly) params.append('groupsOnly', 'true');
      
      // Backend returns Page<ConversationResponse>, so we need to access .content property
      const response = await apiService.get<{
        content: ConversationResponse[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
      }>(`${ENDPOINTS.MESSAGES.CONVERSATIONS}?${params.toString()}`);
      
      // Transform backend format to frontend format
      const conversationResponses = response.data?.content || [];
      const conversations: Conversation[] = conversationResponses.map((conv: ConversationResponse) => ({
        id: `${conv.otherUser.id}`,
        participants: [
          {
            id: conv.otherUser.id.toString(),
            username: conv.otherUser.username,
            email: '',  // Backend doesn't provide email in conversation response
            firstName: conv.otherUser.firstName,
            lastName: conv.otherUser.lastName,
            profilePictureUrl: conv.otherUser.profilePictureUrl,
            isOnline: false,
            lastSeen: new Date()
          }
        ],
        lastMessage: conv.lastMessage ? {
          id: conv.lastMessage.id.toString(),
          content: conv.lastMessage.content,
          senderId: conv.lastMessage.sender.id.toString(),
          messageType: MessageType.TEXT,
          timestamp: new Date(conv.lastMessage.createdAt),
          isRead: conv.lastMessage.readStatus,
          conversationId: `${conv.otherUser.id}`,
          isEdited: false
        } : undefined,
        unreadCount: conv.unreadCount,
        isGroup: false,
        createdAt: new Date(conv.lastActivity),
        updatedAt: new Date(conv.lastActivity)
      }));
      
      return { data: conversations };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return { data: [] };
    }
  },

  getConversationWithUser: async (otherUserId: number) => {
    return apiService.get<MessageResponse[]>(ENDPOINTS.MESSAGES.CONVERSATION(otherUserId));
  },

  sendMessage: async (data: MessageRequest) => {
    return apiService.post<MessageResponse>(ENDPOINTS.MESSAGES.BASE, data);
  },

  getMessage: async (messageId: number) => {
    return apiService.get<MessageResponse>(ENDPOINTS.MESSAGES.BY_ID(messageId));
  },

  markMessageAsRead: async (messageId: number) => {
    return apiService.patch(ENDPOINTS.MESSAGES.MARK_READ(messageId));
  },

  deleteMessage: async (messageId: number) => {
    return apiService.delete(ENDPOINTS.MESSAGES.BY_ID(messageId));
  },

  getUnreadCount: async () => {
    return apiService.get<{ count: number }>('/messages/unread-count');
  },

  // Legacy methods for backward compatibility
  createConversation: async (data: CreateConversationData) => {
    return apiService.post<Conversation>('/messages/conversations', data);
  },

  updateConversation: async (conversationId: string, data: Partial<Conversation>) => {
    return apiService.put<Conversation>(`/messages/conversations/${conversationId}`, data);
  },

  deleteConversation: async (conversationId: string) => {
    return apiService.delete(`/messages/conversations/${conversationId}`);
  },

  getMessages: async (conversationId: string, page: number = 0, size: number = 20) => {
    try {
      // Use the correct backend endpoint pattern that accepts otherUserId
      const response = await apiService.get<{
        content: MessageResponse[];
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
      }>(`${ENDPOINTS.MESSAGES.CONVERSATION(parseInt(conversationId))}?page=${page}&size=${size}`);
      
      // Transform backend format to frontend format
      const messageResponses = response.data?.content || [];
      const messages: Message[] = messageResponses.map((msgResp: MessageResponse) => ({
        id: msgResp.id.toString(),
        content: msgResp.content,
        senderId: msgResp.sender.id.toString(),
        messageType: MessageType.TEXT,
        timestamp: new Date(msgResp.createdAt),
        isRead: msgResp.readStatus,
        conversationId: conversationId,
        isEdited: false
      }));
      
      return { 
        data: {
          messages,
          hasMore: response.data ? response.data.number < response.data.totalPages - 1 : false,
          totalElements: response.data?.totalElements || 0,
          totalPages: response.data?.totalPages || 0
        }
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { 
        data: {
          messages: [],
          hasMore: false,
          totalElements: 0,
          totalPages: 0
        }
      };
    }
  },

  updateMessage: async (messageId: string, data: UpdateMessageData) => {
    return apiService.put<Message>(`/messages/${messageId}`, data);
  },

  markMessagesAsRead: async (conversationId: string) => {
    return apiService.post(`/messages/conversations/${conversationId}/mark-read`);
  },

  searchMessages: async (query: string, conversationId?: string) => {
    const params = new URLSearchParams();
    params.append('query', query);
    if (conversationId) params.append('conversationId', conversationId);
    
    return apiService.get<Message[]>(`/messages/search?${params.toString()}`);
  },

  uploadAttachment: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return httpClient.post<{ fileUrl: string; fileName: string; fileSize: number }>(
      '/messages/upload-attachment', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
}; 