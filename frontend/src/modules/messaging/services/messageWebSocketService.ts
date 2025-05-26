import { WebSocketService, createWebSocketService } from '@/shared/services/webSocketService';
import { Message } from '../types/message.types';
import { WS_BASE_URL, WS_DESTINATIONS } from '@/shared/constants/endpoints';

export interface TypingIndicator {
  userId: number;
  conversationId: number;
  isTyping: boolean;
  timestamp: string;
}

export interface OnlineStatus {
  userId: number;
  isOnline: boolean;
  lastSeen?: string;
}

export interface MessageWebSocketCallbacks {
  onNewMessage?: (message: Message) => void;
  onTypingIndicator?: (indicator: TypingIndicator) => void;
  onOnlineStatus?: (status: OnlineStatus) => void;
  onMessageRead?: (messageId: number, readByUserId: number) => void;
  onError?: (error: Error) => void;
}

class MessageWebSocketService {
  private webSocketService: WebSocketService | null = null;
  private callbacks: MessageWebSocketCallbacks = {};
  private currentUserId: number | null = null;
  private subscriptions: Array<{ unsubscribe: () => void }> = [];

  async initialize(baseURL: string = WS_BASE_URL): Promise<void> {
    try {
      this.webSocketService = createWebSocketService({
        brokerURL: baseURL,
        debug: process.env.NODE_ENV === 'development',
      });

      await this.webSocketService.connect();
      console.log('[MessageWebSocket] WebSocket service initialized');
    } catch (error) {
      console.error('[MessageWebSocket] Initialization failed:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  setCallbacks(callbacks: MessageWebSocketCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  async subscribeToUserMessages(userId: number): Promise<void> {
    if (!this.webSocketService) {
      throw new Error('WebSocket service not initialized');
    }

    this.currentUserId = userId;

    try {
      // Subscribe to direct messages for the user
      const messageSubscription = await this.webSocketService.subscribe(
        WS_DESTINATIONS.USER_MESSAGES(userId),
        (message: Message) => {
          console.log('[MessageWebSocket] New message received:', message);
          this.callbacks.onNewMessage?.(message);
        }
      );
      this.subscriptions.push(messageSubscription);

      // Subscribe to typing indicators
      const typingSubscription = await this.webSocketService.subscribe(
        WS_DESTINATIONS.USER_TYPING(userId),
        (indicator: TypingIndicator) => {
          console.log('[MessageWebSocket] Typing indicator:', indicator);
          this.callbacks.onTypingIndicator?.(indicator);
        }
      );
      this.subscriptions.push(typingSubscription);

      // Subscribe to message read status
      const readStatusSubscription = await this.webSocketService.subscribe(
        WS_DESTINATIONS.USER_READ_STATUS(userId),
        (readStatus: { messageId: number; readByUserId: number }) => {
          console.log('[MessageWebSocket] Message read status:', readStatus);
          this.callbacks.onMessageRead?.(readStatus.messageId, readStatus.readByUserId);
        }
      );
      this.subscriptions.push(readStatusSubscription);

      console.log(`[MessageWebSocket] Subscribed to messages for user ${userId}`);
    } catch (error) {
      console.error('[MessageWebSocket] Subscription failed:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  async subscribeToOnlineStatus(): Promise<void> {
    if (!this.webSocketService) {
      throw new Error('WebSocket service not initialized');
    }

    try {
      const onlineStatusSubscription = await this.webSocketService.subscribe(
        WS_DESTINATIONS.ONLINE_STATUS,
        (status: OnlineStatus) => {
          console.log('[MessageWebSocket] Online status update:', status);
          this.callbacks.onOnlineStatus?.(status);
        }
      );
      this.subscriptions.push(onlineStatusSubscription);

      console.log('[MessageWebSocket] Subscribed to online status updates');
    } catch (error) {
      console.error('[MessageWebSocket] Online status subscription failed:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  async sendTypingIndicator(conversationId: number, isTyping: boolean): Promise<void> {
    if (!this.webSocketService || !this.currentUserId) {
      throw new Error('WebSocket service not initialized or user not set');
    }

    try {
      await this.webSocketService.publish(WS_DESTINATIONS.APP_TYPING, {
        userId: this.currentUserId,
        conversationId,
        isTyping,
        timestamp: new Date().toISOString()
      });

      console.log(`[MessageWebSocket] Typing indicator sent: ${isTyping ? 'typing' : 'stopped typing'}`);
    } catch (error) {
      console.error('[MessageWebSocket] Failed to send typing indicator:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    if (!this.webSocketService || !this.currentUserId) {
      throw new Error('WebSocket service not initialized or user not set');
    }

    try {
      await this.webSocketService.publish(WS_DESTINATIONS.APP_MESSAGE_READ, {
        messageId,
        readByUserId: this.currentUserId,
        readAt: new Date().toISOString()
      });

      console.log(`[MessageWebSocket] Message ${messageId} marked as read`);
    } catch (error) {
      console.error('[MessageWebSocket] Failed to mark message as read:', error);
      this.callbacks.onError?.(error as Error);
      throw error;
    }
  }

  async updateOnlineStatus(isOnline: boolean): Promise<void> {
    if (!this.webSocketService || !this.currentUserId) {
      throw new Error('WebSocket service not initialized or user not set');
    }

    try {
      await this.webSocketService.publish(WS_DESTINATIONS.APP_ONLINE_STATUS, {
        userId: this.currentUserId,
        isOnline,
        timestamp: new Date().toISOString()
      });

      console.log(`[MessageWebSocket] Online status updated: ${isOnline ? 'online' : 'offline'}`);
    } catch (error) {
      console.error('[MessageWebSocket] Failed to update online status:', error);
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
    console.log('[MessageWebSocket] Disconnected and cleaned up');
  }

  getConnectionStatus(): boolean {
    return this.webSocketService?.getConnectionStatus() ?? false;
  }

  getCurrentUserId(): number | null {
    return this.currentUserId;
  }
}

// Singleton instance
let messageWebSocketInstance: MessageWebSocketService | null = null;

export const getMessageWebSocketService = (): MessageWebSocketService => {
  if (!messageWebSocketInstance) {
    messageWebSocketInstance = new MessageWebSocketService();
  }
  return messageWebSocketInstance;
};

export const initializeMessageWebSocket = async (baseURL?: string, userId?: number): Promise<MessageWebSocketService> => {
  const service = getMessageWebSocketService();
  await service.initialize(baseURL);
  
  if (userId) {
    await service.subscribeToUserMessages(userId);
    await service.subscribeToOnlineStatus();
  }
  
  return service;
};

export { MessageWebSocketService }; 