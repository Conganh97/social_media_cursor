export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  timestamp: Date;
  isRead: boolean;
  isEdited: boolean;
  editedAt?: Date;
  replyToId?: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageData {
  conversationId: string;
  content: string;
  messageType?: MessageType;
  replyToId?: string;
  attachments?: File[];
}

export interface UpdateMessageData {
  content: string;
}

export interface CreateConversationData {
  participantIds: string[];
  isGroup?: boolean;
  groupName?: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  username: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface MessageState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;
  typingIndicators: Record<string, TypingIndicator[]>;
  onlineUsers: Record<string, boolean>;
  loading: boolean;
  error: string | null;
  hasMoreMessages: Record<string, boolean>;
  messageLoading: Record<string, boolean>;
}

export interface PaginatedMessages {
  messages: Message[];
  hasMore: boolean;
  totalCount: number;
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
  conversationId?: string;
  userId?: string;
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  VOICE = 'VOICE',
  SYSTEM = 'SYSTEM'
}

export enum WebSocketMessageType {
  MESSAGE_SENT = 'MESSAGE_SENT',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  MESSAGE_UPDATED = 'MESSAGE_UPDATED',
  MESSAGE_DELETED = 'MESSAGE_DELETED',
  TYPING_START = 'TYPING_START',
  TYPING_STOP = 'TYPING_STOP',
  USER_ONLINE = 'USER_ONLINE',
  USER_OFFLINE = 'USER_OFFLINE',
  CONVERSATION_CREATED = 'CONVERSATION_CREATED',
  CONVERSATION_UPDATED = 'CONVERSATION_UPDATED'
}

export interface MessageFormData {
  content: string;
  attachments: File[];
  replyToId?: string;
}

export interface ConversationFilters {
  search?: string;
  unreadOnly?: boolean;
  groupsOnly?: boolean;
} 