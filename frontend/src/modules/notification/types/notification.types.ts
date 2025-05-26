export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author: User;
  createdAt: string;
}

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',
  MESSAGE = 'MESSAGE',
  POST_MENTION = 'POST_MENTION',
  COMMENT_MENTION = 'COMMENT_MENTION',
  SYSTEM = 'SYSTEM'
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  actorId?: string;
  actor?: User;
  entityId?: string;
  entityType?: string;
  data?: Record<string, any>;
  post?: Post;
  comment?: Comment;
}

export interface NotificationGroup {
  type: NotificationType;
  notifications: Notification[];
  count: number;
  latestNotification: Notification;
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  likes: boolean;
  comments: boolean;
  friendRequests: boolean;
  messages: boolean;
  mentions: boolean;
  systemUpdates: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  filters: NotificationFilters;
  settings: NotificationSettings;
  groupedNotifications: NotificationGroup[];
  lastFetch: string | null;
}

export interface PaginatedNotificationResponse {
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

export interface NotificationWebSocketMessage {
  type: 'NOTIFICATION_RECEIVED' | 'NOTIFICATION_READ' | 'NOTIFICATION_DELETED';
  notification?: Notification;
  notificationId?: string;
  userId: string;
}

export interface CreateNotificationData {
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  actorId?: string;
  entityId?: string;
  entityType?: string;
  data?: Record<string, any>;
}

export interface UpdateNotificationData {
  isRead?: boolean;
  title?: string;
  message?: string;
}

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
} 