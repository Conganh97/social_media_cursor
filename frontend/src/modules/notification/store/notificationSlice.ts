import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Notification,
  NotificationState,
  NotificationFilters,
  NotificationSettings,
  NotificationGroup,
  NotificationType,
  PaginatedNotificationResponse,
  UpdateNotificationData
} from '../types/notification.types';
import { notificationApi } from '../services/notificationApi';

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  hasMore: true,
  filters: {
    limit: 20,
    offset: 0
  },
  settings: {
    emailNotifications: true,
    pushNotifications: true,
    likes: true,
    comments: true,
    friendRequests: true,
    messages: true,
    mentions: true,
    systemUpdates: true
  },
  groupedNotifications: [],
  lastFetch: null
};

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (filters?: NotificationFilters) => {
    const response = await notificationApi.getNotifications(filters);
    return response;
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: string) => {
    await notificationApi.markAsRead(notificationId);
    return notificationId;
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async () => {
    await notificationApi.markAllAsRead();
    return true;
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId: string) => {
    await notificationApi.deleteNotification(notificationId);
    return notificationId;
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'notification/updateSettings',
  async (settings: Partial<NotificationSettings>) => {
    const response = await notificationApi.updateSettings(settings);
    return response;
  }
);

export const getNotificationSettings = createAsyncThunk(
  'notification/getSettings',
  async () => {
    const response = await notificationApi.getSettings();
    return response;
  }
);

export const getUnreadCount = createAsyncThunk(
  'notification/getUnreadCount',
  async () => {
    const response = await notificationApi.getUnreadCount();
    return response.unreadCount;
  }
);

const groupNotificationsByType = (notifications: Notification[]): NotificationGroup[] => {
  const groups: { [key in NotificationType]?: Notification[] } = {};
  
  notifications.forEach(notification => {
    if (!groups[notification.type]) {
      groups[notification.type] = [];
    }
    groups[notification.type]!.push(notification);
  });

  return Object.entries(groups).map(([type, notifications]) => ({
    type: type as NotificationType,
    notifications: notifications!,
    count: notifications!.length,
    latestNotification: notifications![0]
  }));
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
      state.groupedNotifications = groupNotificationsByType(state.notifications);
    },
    
    updateNotificationInState: (state, action: PayloadAction<{ id: string; updates: UpdateNotificationData }>) => {
      const { id, updates } = action.payload;
      const notification = state.notifications.find(n => n.id === id);
      if (notification) {
        Object.assign(notification, updates);
        if (updates.isRead === true && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else if (updates.isRead === false && notification.isRead) {
          state.unreadCount += 1;
        }
        state.groupedNotifications = groupNotificationsByType(state.notifications);
      }
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      const notificationIndex = state.notifications.findIndex(n => n.id === action.payload);
      if (notificationIndex !== -1) {
        const notification = state.notifications[notificationIndex];
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(notificationIndex, 1);
        state.groupedNotifications = groupNotificationsByType(state.notifications);
      }
    },
    
    setFilters: (state, action: PayloadAction<NotificationFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.groupedNotifications = [];
      state.hasMore = true;
    },
    
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<PaginatedNotificationResponse>) => {
        state.loading = false;
        const { notifications, hasMore, unreadCount } = action.payload;
        
        if (state.filters.offset === 0) {
          state.notifications = notifications;
        } else {
          state.notifications.push(...notifications);
        }
        
        state.hasMore = hasMore;
        state.unreadCount = unreadCount;
        state.groupedNotifications = groupNotificationsByType(state.notifications);
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      
      .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<string>) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
          state.groupedNotifications = groupNotificationsByType(state.notifications);
        }
      })
      
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
        state.groupedNotifications = groupNotificationsByType(state.notifications);
      })
      
      .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<string>) => {
        const notificationIndex = state.notifications.findIndex(n => n.id === action.payload);
        if (notificationIndex !== -1) {
          const notification = state.notifications[notificationIndex];
          if (!notification.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(notificationIndex, 1);
          state.groupedNotifications = groupNotificationsByType(state.notifications);
        }
      })
      
      .addCase(updateNotificationSettings.fulfilled, (state, action: PayloadAction<NotificationSettings>) => {
        state.settings = action.payload;
      })
      
      .addCase(getNotificationSettings.fulfilled, (state, action: PayloadAction<NotificationSettings>) => {
        state.settings = action.payload;
      })
      
      .addCase(getUnreadCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.unreadCount = action.payload;
      });
  }
});

export const {
  addNotification,
  updateNotificationInState,
  removeNotification,
  setFilters,
  clearNotifications,
  setUnreadCount,
  clearError
} = notificationSlice.actions;

export default notificationSlice.reducer; 