import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Notification as NotificationData, NotificationWebSocketMessage } from '../types/notification.types';

type NotificationCallback = (notification: NotificationData) => void;
type NotificationUpdateCallback = (notificationId: string) => void;
type NotificationDeleteCallback = (notificationId: string) => void;

class NotificationWebSocketService {
  private client: Client | null = null;
  private subscription: StompSubscription | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private userId: string | null = null;

  private onNotificationReceived: NotificationCallback | null = null;
  private onNotificationRead: NotificationUpdateCallback | null = null;
  private onNotificationDeleted: NotificationDeleteCallback | null = null;

  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected && this.userId === userId) {
        resolve();
        return;
      }

      this.userId = userId;
      this.disconnect();

      try {
        const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws`);
        
        this.client = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          debug: (str) => {
            if (import.meta.env.DEV) {
              console.log('STOMP Debug:', str);
            }
          },
          reconnectDelay: this.reconnectDelay,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.subscribeToNotifications();
            resolve();
          },
          onStompError: (frame) => {
            console.error('STOMP error:', frame);
            this.isConnected = false;
            reject(new Error(`STOMP error: ${frame.headers.message}`));
          },
          onWebSocketError: (error) => {
            console.error('WebSocket error:', error);
            this.isConnected = false;
            reject(error);
          },
          onDisconnect: () => {
            this.isConnected = false;
            this.handleDisconnection();
          }
        });

        this.client.activate();
      } catch (error) {
        console.error('Failed to connect to notification WebSocket:', error);
        reject(error);
      }
    });
  }

  private subscribeToNotifications(): void {
    if (!this.client || !this.userId) return;

    try {
      this.subscription = this.client.subscribe(
        `/user/${this.userId}/notifications`,
        (message) => {
          try {
            const data: NotificationWebSocketMessage = JSON.parse(message.body);
            this.handleWebSocketMessage(data);
          } catch (error) {
            console.error('Error parsing notification message:', error);
          }
        }
      );
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
    }
  }

  private handleWebSocketMessage(data: NotificationWebSocketMessage): void {
    switch (data.type) {
      case 'NOTIFICATION_RECEIVED':
        if (data.notification && this.onNotificationReceived) {
          this.onNotificationReceived(data.notification);
        }
        break;
      case 'NOTIFICATION_READ':
        if (data.notificationId && this.onNotificationRead) {
          this.onNotificationRead(data.notificationId);
        }
        break;
      case 'NOTIFICATION_DELETED':
        if (data.notificationId && this.onNotificationDeleted) {
          this.onNotificationDeleted(data.notificationId);
        }
        break;
      default:
        console.warn('Unknown notification WebSocket message type:', data.type);
    }
  }

  private handleDisconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect notification WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
      
      setTimeout(() => {
        if (this.userId) {
          this.connect(this.userId).catch(console.error);
        }
      }, delay);
    } else {
      console.error('Max reconnection attempts reached for notification WebSocket');
    }
  }

  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.userId = null;
  }

  setOnNotificationReceived(callback: NotificationCallback): void {
    this.onNotificationReceived = callback;
  }

  setOnNotificationRead(callback: NotificationUpdateCallback): void {
    this.onNotificationRead = callback;
  }

  setOnNotificationDeleted(callback: NotificationDeleteCallback): void {
    this.onNotificationDeleted = callback;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  sendNotificationRead(notificationId: string): void {
    if (this.client && this.isConnected) {
      try {
        this.client.publish({
          destination: '/app/notification/read',
          body: JSON.stringify({ notificationId })
        });
      } catch (error) {
        console.error('Error sending notification read status:', error);
      }
    }
  }

  requestNotificationPermission(): Promise<NotificationPermission> {
    return new Promise((resolve) => {
      if (!('Notification' in window)) {
        resolve('denied' as NotificationPermission);
        return;
      }

      if (Notification.permission === 'granted') {
        resolve('granted' as NotificationPermission);
        return;
      }

      if (Notification.permission === 'denied') {
        resolve('denied' as NotificationPermission);
        return;
      }

      Notification.requestPermission().then((permission) => {
        resolve(permission as NotificationPermission);
      });
    });
  }

  showBrowserNotification(notification: NotificationData): void {
    if (Notification.permission === 'granted') {
      const browserNotification = new window.Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: false,
        silent: false
      });

      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
      };

      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }
}

export const notificationWebSocketService = new NotificationWebSocketService(); 