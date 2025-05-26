export const ROUTE_PATHS = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  
  USER: {
    PROFILE: '/profile',
    PROFILE_BY_ID: '/profile/:id',
    EDIT_PROFILE: '/profile/edit',
    USERS: '/users',
    USER_SETTINGS: '/profile/settings',
  },
  
  POSTS: {
    FEED: '/feed',
    POST_DETAIL: '/post/:id',
    CREATE_POST: '/post/create',
    EDIT_POST: '/post/:id/edit',
  },
  
  SOCIAL: {
    FRIENDS: '/friends',
    FRIEND_REQUESTS: '/friends/requests',
    PEOPLE: '/people',
    ACTIVITIES: '/activities',
  },
  
  MESSAGING: {
    MESSAGES: '/messages',
    CHAT: '/messages/:conversationId',
    NEW_CONVERSATION: '/messages/new',
  },
  
  NOTIFICATIONS: {
    NOTIFICATIONS: '/notifications',
    NOTIFICATION_SETTINGS: '/notifications/settings',
  },
  
  SETTINGS: {
    GENERAL: '/settings',
    PRIVACY: '/settings/privacy',
    SECURITY: '/settings/security',
    NOTIFICATIONS: '/settings/notifications',
    APPEARANCE: '/settings/appearance',
  },
  
  ERROR: {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/401',
    SERVER_ERROR: '/500',
  },
} as const;

export const ROUTE_GUARDS = {
  PUBLIC: 'public',
  PROTECTED: 'protected',
  GUEST_ONLY: 'guest_only',
  ADMIN_ONLY: 'admin_only',
} as const;

export const getRouteByPath = (path: string) => {
  return path;
};

export const getRouteTitle = (path: string): string => {
  const routeTitles: Record<string, string> = {
    [ROUTE_PATHS.HOME]: 'Welcome to Social Media App',
    [ROUTE_PATHS.DASHBOARD]: 'Dashboard',
    [ROUTE_PATHS.AUTH.LOGIN]: 'Login',
    [ROUTE_PATHS.AUTH.REGISTER]: 'Register',
    [ROUTE_PATHS.USER.PROFILE]: 'Profile',
    [ROUTE_PATHS.USER.EDIT_PROFILE]: 'Edit Profile',
    [ROUTE_PATHS.USER.USERS]: 'Users',
    [ROUTE_PATHS.POSTS.FEED]: 'Feed',
    [ROUTE_PATHS.SOCIAL.FRIENDS]: 'Friends',
    [ROUTE_PATHS.MESSAGING.MESSAGES]: 'Messages',
    [ROUTE_PATHS.NOTIFICATIONS.NOTIFICATIONS]: 'Notifications',
    [ROUTE_PATHS.ERROR.NOT_FOUND]: 'Page Not Found',
    [ROUTE_PATHS.ERROR.UNAUTHORIZED]: 'Unauthorized',
    [ROUTE_PATHS.ERROR.SERVER_ERROR]: 'Server Error',
  };
  
  return routeTitles[path] || 'Social Media App';
};

export const getRouteBreadcrumb = (path: string): string => {
  const breadcrumbs: Record<string, string> = {
    [ROUTE_PATHS.HOME]: 'Home',
    [ROUTE_PATHS.DASHBOARD]: 'Dashboard',
    [ROUTE_PATHS.AUTH.LOGIN]: 'Login',
    [ROUTE_PATHS.AUTH.REGISTER]: 'Register',
    [ROUTE_PATHS.USER.PROFILE]: 'Profile',
    [ROUTE_PATHS.USER.EDIT_PROFILE]: 'Edit Profile',
    [ROUTE_PATHS.USER.USERS]: 'Users',
    [ROUTE_PATHS.POSTS.FEED]: 'Feed',
    [ROUTE_PATHS.SOCIAL.FRIENDS]: 'Friends',
    [ROUTE_PATHS.MESSAGING.MESSAGES]: 'Messages',
    [ROUTE_PATHS.NOTIFICATIONS.NOTIFICATIONS]: 'Notifications',
    [ROUTE_PATHS.ERROR.NOT_FOUND]: '404',
    [ROUTE_PATHS.ERROR.UNAUTHORIZED]: '401',
    [ROUTE_PATHS.ERROR.SERVER_ERROR]: '500',
  };
  
  return breadcrumbs[path] || 'Page';
}; 