import { WebSocketService, createWebSocketService } from '@/shared/services/webSocketService';
import { Notification } from '../types/notification.types';
import { WS_BASE_URL, WS_DESTINATIONS } from '@/shared/constants/endpoints';

export interface NotificationWebSocketCallbacks {
  onNewNotification?: (notification: Notification) => void;
  onNotificationRead?: (notificationId: number) => void;
  onNotificationDeleted?: (notificationId: number) => void;
  onNotificationCountUpdate?: (count: number) => void;
  onError?: (error: Error) => void;
}

class NotificationWebSocketService {
  private webSocketService: WebSocketService | null = null;
  private callbacks: NotificationWebSocketCallbacks = {};
  private currentUserId: number | null = null;
  private subscriptions: Array<{ unsubscribe: () => void }> = [];

  async initialize(baseURL: string = WS_BASE_URL): Promise<void> {
    try {
      this.webSocketService = createWebSocketService({
        brokerURL: baseURL,
        debug: process.env.NODE_ENV === 'development',
      });

      await this.webSocketService.connect();
      console.log('[NotificationWebSocket] WebSocket service initialized');
    } catch (error) {
      console.error('[NotificationWebSocket] Initialization failed:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  setCallbacks(callbacks: NotificationWebSocketCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  async subscribeToUserNotifications(userId: number): Promise<void> {
    if (!this.webSocketService) {
      throw new Error('WebSocket service not initialized');
    }

    this.currentUserId = userId;

    try {
      // Subscribe to new notifications for the user
      const notificationSubscription = await this.webSocketService.subscribe(
        WS_DESTINATIONS.USER_NOTIFICATIONS(userId),
        (notification: Notification) => {
          console.log('[NotificationWebSocket] New notification received:', notification);
          this.callbacks.onNewNotification?.(notification);
        }
      );
      this.subscriptions.push(notificationSubscription);

      // Subscribe to notification read status updates
      const readStatusSubscription = await this.webSocketService.subscribe(
        WS_DESTINATIONS.USER_NOTIFICATION_STATUS(userId),
        (status: { notificationId: number; action: 'read' | 'deleted' }) => {
          console.log('[NotificationWebSocket] Notification status update:', status);
          if (status.action === 'read') {
            this.callbacks.onNotificationRead?.(status.notificationId);
          } else if (status.action === 'deleted') {
            this.callbacks.onNotificationDeleted?.(status.notificationId);
          }
        }
      );
      this.subscriptions.push(readStatusSubscription);

      // Subscribe to notification count updates
      const countSubscription = await this.webSocketService.subscribe(
        WS_DESTINATIONS.USER_NOTIFICATION_COUNT(userId),
        (countUpdate: { unreadCount: number }) => {
          console.log('[NotificationWebSocket] Notification count update:', countUpdate);
          this.callbacks.onNotificationCountUpdate?.(countUpdate.unreadCount);
        }
      );
      this.subscriptions.push(countSubscription);

      console.log(`[NotificationWebSocket] Subscribed to notifications for user ${userId}`);
    } catch (error) {
      console.error('[NotificationWebSocket] Subscription failed:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    if (!this.webSocketService || !this.currentUserId) {
      throw new Error('WebSocket service not initialized or user not set');
    }

    try {
      await this.webSocketService.publish(WS_DESTINATIONS.APP_NOTIFICATION_READ, {
        notificationId,
        userId: this.currentUserId,
        readAt: new Date().toISOString()
      });

      console.log(`[NotificationWebSocket] Notification ${notificationId} marked as read`);
    } catch (error) {
      console.error('[NotificationWebSocket] Failed to mark notification as read:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    if (!this.webSocketService || !this.currentUserId) {
      throw new Error('WebSocket service not initialized or user not set');
    }

    try {
      await this.webSocketService.publish(WS_DESTINATIONS.APP_NOTIFICATIONS_READ_ALL, {
        userId: this.currentUserId,
        readAt: new Date().toISOString()
      });

      console.log('[NotificationWebSocket] All notifications marked as read');
    } catch (error) {
      console.error('[NotificationWebSocket] Failed to mark all notifications as read:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  async deleteNotification(notificationId: number): Promise<void> {
    if (!this.webSocketService || !this.currentUserId) {
      throw new Error('WebSocket service not initialized or user not set');
    }

    try {
      await this.webSocketService.publish(WS_DESTINATIONS.APP_NOTIFICATION_DELETE, {
        notificationId,
        userId: this.currentUserId,
        deletedAt: new Date().toISOString()
      });

      console.log(`[NotificationWebSocket] Notification ${notificationId} deleted`);
    } catch (error) {
      console.error('[NotificationWebSocket] Failed to delete notification:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  disconnect(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];

    // Disconnect WebSocket service
    if (this.webSocketService) {
      this.webSocketService.disconnect();
      this.webSocketService = null;
    }

    this.currentUserId = null;
    this.callbacks = {};
    console.log('[NotificationWebSocket] Disconnected and cleaned up');
  }

  getConnectionStatus(): boolean {
    return this.webSocketService?.getConnectionStatus() ?? false;
  }

  getCurrentUserId(): number | null {
    return this.currentUserId;
  }
}

// Singleton instance
let notificationWebSocketInstance: NotificationWebSocketService | null = null;

export const getNotificationWebSocketService = (): NotificationWebSocketService => {
  if (!notificationWebSocketInstance) {
    notificationWebSocketInstance = new NotificationWebSocketService();
  }
  return notificationWebSocketInstance;
};

export const initializeNotificationWebSocket = async (baseURL?: string, userId?: number): Promise<NotificationWebSocketService> => {
  const service = getNotificationWebSocketService();
  await service.initialize(baseURL);
  
  if (userId) {
    await service.subscribeToUserNotifications(userId);
  }
  
  return service;
};

export { NotificationWebSocketService }; 