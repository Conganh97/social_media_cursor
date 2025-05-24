export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    ME: '/users/me',
    BY_ID: (id: number) => `/users/${id}`,
    SEARCH: '/users/search',
    UPLOAD_AVATAR: '/users/upload-avatar',
    USERS_BY_IDS: '/users/users-by-ids',
    DEACTIVATE: (id: number) => `/users/${id}/deactivate`,
  },
  POSTS: {
    BASE: '/posts',
    BY_ID: (id: number) => `/posts/${id}`,
    FEED: '/posts/feed',
    USER_POSTS: (userId: number) => `/posts/user/${userId}`,
    RECENT: '/posts/recent',
    COUNT_BY_USER: (userId: number) => `/posts/count/user/${userId}`,
  },
  COMMENTS: {
    BASE: '/comments',
    BY_ID: (id: number) => `/comments/${id}`,
    BY_POST: (postId: number) => `/comments/post/${postId}`,
    COUNT_BY_POST: (postId: number) => `/comments/count/post/${postId}`,
    RECENT_BY_POST: (postId: number) => `/comments/recent/post/${postId}`,
  },
  LIKES: {
    LIKE_POST: (postId: number) => `/likes/post/${postId}`,
    UNLIKE_POST: (postId: number) => `/likes/post/${postId}`,
    IS_LIKED: (postId: number) => `/likes/post/${postId}/status`,
    LIKERS: (postId: number) => `/likes/post/${postId}/users`,
    USER_LIKED_POSTS: (userId: number) => `/likes/user/${userId}/posts`,
    COUNT_BY_POST: (postId: number) => `/likes/count/post/${postId}`,
    RECENT_LIKERS: (postId: number) => `/likes/recent/post/${postId}`,
  },
  FRIENDSHIPS: {
    SEND_REQUEST: '/friendships/send',
    ACCEPT: (id: number) => `/friendships/${id}/accept`,
    REJECT: (id: number) => `/friendships/${id}/reject`,
    FRIENDS: '/friendships/friends',
    PENDING: '/friendships/pending',
    SENT: '/friendships/sent',
    STATUS: '/friendships/status',
    COUNT: '/friendships/count',
  },
  MESSAGES: {
    BASE: '/messages',
    BY_ID: (id: number) => `/messages/${id}`,
    CONVERSATION: '/messages/conversation',
    CONVERSATIONS: '/messages/conversations',
    MARK_READ: (id: number) => `/messages/${id}/read`,
    UNREAD_COUNT: '/messages/unread-count',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: number) => `/notifications/${id}`,
    MARK_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    UNREAD_COUNT: '/notifications/unread-count',
    SUMMARY: '/notifications/summary',
  },
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 0,
  SIZE: 10,
  MAX_SIZE: 100,
} as const;

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  POST_CONTENT: {
    MAX_LENGTH: 1000,
  },
  COMMENT_CONTENT: {
    MAX_LENGTH: 500,
  },
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  NOTIFICATION: 'notification',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
} as const;

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  USER_PROFILE: (id: number) => `/profile/${id}`,
  FEED: '/feed',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  FRIENDS: '/friends',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
} as const;

export const THEME_COLORS = {
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#2e7d32',
  ERROR: '#d32f2f',
  WARNING: '#ed6c02',
  INFO: '#0288d1',
} as const; 