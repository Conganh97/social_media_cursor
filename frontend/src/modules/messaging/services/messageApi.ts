import { apiService } from '@/shared/services';
import { httpClient } from '@/shared/services/httpClient';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { 
  Conversation, 
  Message, 
  CreateMessageData, 
  UpdateMessageData,
  CreateConversationData,
  PaginatedMessages,
  ConversationFilters
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

export const messageApi = {
  getConversations: async (filters?: ConversationFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.unreadOnly) params.append('unreadOnly', 'true');
    if (filters?.groupsOnly) params.append('groupsOnly', 'true');
    
    return apiService.get<Conversation[]>(`${ENDPOINTS.MESSAGES.CONVERSATIONS}?${params.toString()}`);
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
    return apiService.get<PaginatedMessages>(
      `/messages/conversations/${conversationId}/messages?page=${page}&size=${size}`
    );
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