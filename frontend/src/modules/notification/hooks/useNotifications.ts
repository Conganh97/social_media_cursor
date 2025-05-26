import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  updateNotificationSettings,
  getNotificationSettings,
  getUnreadCount,
  setFilters,
  clearNotifications,
  addNotification,
  updateNotificationInState,
  removeNotification
} from '../store/notificationSlice';
import { notificationWebSocketService } from '../services/notificationWebSocket';
import { NotificationFilters } from '../types/notification.types';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    filters,
    settings,
    groupedNotifications,
    lastFetch
  } = useSelector((state: RootState) => state.notification);

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const fetchNotificationsData = useCallback(
    (newFilters?: NotificationFilters) => {
      const filtersToUse = newFilters || filters;
      dispatch(fetchNotifications(filtersToUse) as any);
    },
    [dispatch, filters]
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextFilters = {
        ...filters,
        offset: notifications.length
      };
      dispatch(fetchNotifications(nextFilters) as any);
    }
  }, [dispatch, filters, notifications.length, hasMore, loading]);

  const markAsRead = useCallback(
    (notificationId: string) => {
      dispatch(markNotificationAsRead(notificationId) as any);
    },
    [dispatch]
  );

  const markAllAsRead = useCallback(() => {
    dispatch(markAllNotificationsAsRead() as any);
  }, [dispatch]);

  const deleteNotificationById = useCallback(
    (notificationId: string) => {
      dispatch(deleteNotification(notificationId) as any);
    },
    [dispatch]
  );

  const updateSettings = useCallback(
    (newSettings: Partial<typeof settings>) => {
      dispatch(updateNotificationSettings(newSettings) as any);
    },
    [dispatch]
  );

  const getSettings = useCallback(() => {
    dispatch(getNotificationSettings() as any);
  }, [dispatch]);

  const refreshUnreadCount = useCallback(() => {
    dispatch(getUnreadCount() as any);
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters: NotificationFilters) => {
      dispatch(setFilters(newFilters));
      fetchNotificationsData(newFilters);
    },
    [dispatch, fetchNotificationsData]
  );

  const clearAllNotifications = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  const connectWebSocket = useCallback(() => {
    if (currentUser?.id) {
      notificationWebSocketService.connect(String(currentUser.id)).catch(console.error);

      notificationWebSocketService.setOnNotificationReceived((notification) => {
        dispatch(addNotification(notification));
        
        if (notificationWebSocketService.requestNotificationPermission) {
          notificationWebSocketService.requestNotificationPermission().then((permission) => {
            if (permission === 'granted') {
              notificationWebSocketService.showBrowserNotification(notification);
            }
          });
        }
      });

      notificationWebSocketService.setOnNotificationRead((notificationId) => {
        dispatch(updateNotificationInState({ 
          id: notificationId, 
          updates: { isRead: true } 
        }));
      });

      notificationWebSocketService.setOnNotificationDeleted((notificationId) => {
        dispatch(removeNotification(notificationId));
      });
    }
  }, [currentUser?.id, dispatch]);

  const disconnectWebSocket = useCallback(() => {
    notificationWebSocketService.disconnect();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      connectWebSocket();
      if (!lastFetch) {
        fetchNotificationsData();
        getSettings();
        refreshUnreadCount();
      }
    }

    return () => {
      disconnectWebSocket();
    };
  }, [currentUser?.id, connectWebSocket, disconnectWebSocket, fetchNotificationsData, getSettings, refreshUnreadCount, lastFetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser?.id) {
        refreshUnreadCount();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser?.id, refreshUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    filters,
    settings,
    groupedNotifications,
    lastFetch,
    
    fetchNotifications: fetchNotificationsData,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotificationById,
    updateSettings,
    getSettings,
    refreshUnreadCount,
    setFilters: updateFilters,
    clearNotifications: clearAllNotifications,
    
    connectWebSocket,
    disconnectWebSocket,
    
    isConnected: notificationWebSocketService.getConnectionStatus()
  };
}; 