// API Base URLs
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8080/ws';

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    BY_ID: (id: number) => `/users/${id}`,
    SEARCH: '/users/search',
    UPLOAD_AVATAR: '/users/upload-avatar',
  },

  // Posts
  POSTS: {
    BASE: '/posts',
    FEED: '/posts/feed',
    BY_ID: (id: number) => `/posts/${id}`,
    USER_POSTS: (userId: number) => `/posts/user/${userId}`,
    SEARCH: '/posts/search',
    RECENT: '/posts/recent',
    TRENDING: '/posts/trending',
    BY_TAG: (tag: string) => `/posts/tag/${encodeURIComponent(tag)}`,
    COUNT: (userId: number) => `/posts/count/user/${userId}`,
    REPORT: (postId: number) => `/posts/${postId}/report`,
    SHARE: (postId: number) => `/posts/${postId}/share`,
  },

  // Social
  SOCIAL: {
    // Comments
    COMMENTS: {
      BASE: '/comments',
      BY_POST: (postId: number) => `/comments/post/${postId}`,
      BY_ID: (commentId: number) => `/comments/${commentId}`,
      COUNT: (postId: number) => `/comments/count/post/${postId}`,
      RECENT: (postId: number) => `/comments/recent/post/${postId}`,
    },
    // Likes
    LIKES: {
      BASE: '/likes',
      BY_POST: (postId: number) => `/likes/post/${postId}`,
      TOGGLE: (postId: number) => `/likes/post/${postId}/toggle`,
      STATUS: (postId: number) => `/likes/post/${postId}/status`,
      USERS: (postId: number) => `/likes/post/${postId}`,
      COUNT: (postId: number) => `/likes/count/post/${postId}`,
      RECENT: (postId: number) => `/likes/post/${postId}/recent`,
      USER_LIKED_POSTS: (userId: number) => `/likes/user/${userId}/posts`,
      USER_TOTAL_LIKES: (userId: number) => `/likes/count/user/${userId}`,
    },
    // Friendships
    FRIENDSHIPS: {
      BASE: '/friendships',
      REQUEST: '/friendships/request',
      ACCEPT: (id: number) => `/friendships/${id}/accept`,
      REJECT: (id: number) => `/friendships/${id}/reject`,
      FRIENDS: '/friendships/friends',
      PENDING: '/friendships/pending',
      SENT: '/friendships/sent',
      STATUS: (userId: number) => `/friendships/status/${userId}`,
      COUNT: '/friendships/count',
    },
  },

  // Messages
  MESSAGES: {
    BASE: '/messages',
    CONVERSATIONS: '/messages/conversations',
    CONVERSATION: (otherUserId: number) => `/messages/conversation/${otherUserId}`,
    BY_ID: (messageId: number) => `/messages/${messageId}`,
    MARK_READ: (messageId: number) => `/messages/${messageId}/read`,
    TYPING: '/messages/typing',
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_UNREAD: (id: string) => `/notifications/${id}/unread`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE_ALL: '/notifications/all',
    UNREAD_COUNT: '/notifications/unread-count',
    SETTINGS: '/notifications/settings',
    TEST: '/notifications/test',
    BY_TYPE: '/notifications/type',
    BULK_READ: '/notifications/bulk-read',
    BULK_DELETE: '/notifications/bulk-delete',
    PUSH_SUBSCRIPTION: '/notifications/push-subscription',
  },

  // Files
  FILES: {
    UPLOAD: '/files/upload',
    UPLOAD_PROFILE: '/files/upload/profile-image',
    UPLOAD_POST: '/files/upload/post-image',
    DELETE: (fileId: string) => `/files/${fileId}`,
  },

  // Bookmarks
  BOOKMARKS: {
    POSTS: '/bookmarks/posts',
    POST: (postId: number) => `/bookmarks/post/${postId}`,
  },
} as const;

// WebSocket Destinations
export const WS_DESTINATIONS = {
  // User-specific queues
  USER_MESSAGES: (userId: number) => `/user/${userId}/queue/messages`,
  USER_TYPING: (userId: number) => `/user/${userId}/queue/typing`,
  USER_READ_STATUS: (userId: number) => `/user/${userId}/queue/read-status`,
  USER_NOTIFICATIONS: (userId: number) => `/user/${userId}/queue/notifications`,
  USER_NOTIFICATION_STATUS: (userId: number) => `/user/${userId}/queue/notification-status`,
  USER_NOTIFICATION_COUNT: (userId: number) => `/user/${userId}/queue/notification-count`,

  // Topic subscriptions
  ONLINE_STATUS: '/topic/online-status',
  
  // Application destinations (for publishing)
  APP_TYPING: '/app/typing',
  APP_MESSAGE_READ: '/app/message-read',
  APP_ONLINE_STATUS: '/app/online-status',
  APP_NOTIFICATION_READ: '/app/notification-read',
  APP_NOTIFICATIONS_READ_ALL: '/app/notifications-read-all',
  APP_NOTIFICATION_DELETE: '/app/notification-delete',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const; 