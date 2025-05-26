import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { store } from '@/store';
import { 
  addMessage, 
  updateMessageInState, 
  removeMessage, 
  setTypingIndicator, 
  setUserOnlineStatus,
  addConversation,
  updateConversation
} from '../store/messageSlice';
import { 
  Message, 
  TypingIndicator, 
  WebSocketMessage, 
  WebSocketMessageType,
  Conversation
} from '../types/message.types';

class MessageWebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscriptions: Map<string, any> = new Map();

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`);
        
        this.client = new Client({
          webSocketFactory: () => socket,
          connectHeaders: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
          debug: (str) => {
            if (import.meta.env.DEV) {
              console.log('WebSocket Debug:', str);
            }
          },
          reconnectDelay: this.reconnectDelay,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            console.log('WebSocket connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.setupSubscriptions();
            resolve();
          },
          onDisconnect: () => {
            console.log('WebSocket disconnected');
            this.isConnected = false;
            this.clearSubscriptions();
          },
          onStompError: (frame) => {
            console.error('WebSocket STOMP error:', frame);
            reject(new Error(`WebSocket error: ${frame.headers['message']}`));
          },
          onWebSocketError: (error) => {
            console.error('WebSocket error:', error);
            this.handleReconnect();
          },
          onWebSocketClose: () => {
            console.log('WebSocket connection closed');
            this.handleReconnect();
          }
        });

        this.client.activate();
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.client) {
      this.clearSubscriptions();
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
    }
  }

  private setupSubscriptions(): void {
    if (!this.client || !this.isConnected) return;

    const userId = this.getCurrentUserId();
    if (!userId) return;

    this.subscribeToUserMessages(userId);
    this.subscribeToUserNotifications(userId);
    this.subscribeToTypingIndicators();
    this.subscribeToOnlineStatus();
  }

  private subscribeToUserMessages(userId: string): void {
    if (!this.client) return;

    const subscription = this.client.subscribe(
      `/user/${userId}/messages`,
      (message: IMessage) => {
        try {
          const wsMessage: WebSocketMessage = JSON.parse(message.body);
          this.handleWebSocketMessage(wsMessage);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      }
    );

    this.subscriptions.set('userMessages', subscription);
  }

  private subscribeToUserNotifications(userId: string): void {
    if (!this.client) return;

    const subscription = this.client.subscribe(
      `/user/${userId}/notifications`,
      (message: IMessage) => {
        try {
          const wsMessage: WebSocketMessage = JSON.parse(message.body);
          this.handleWebSocketMessage(wsMessage);
        } catch (error) {
          console.error('Error parsing WebSocket notification:', error);
        }
      }
    );

    this.subscriptions.set('userNotifications', subscription);
  }

  private subscribeToTypingIndicators(): void {
    if (!this.client) return;

    const subscription = this.client.subscribe(
      '/topic/typing',
      (message: IMessage) => {
        try {
          const typingIndicator: TypingIndicator = JSON.parse(message.body);
          store.dispatch(setTypingIndicator(typingIndicator));
        } catch (error) {
          console.error('Error parsing typing indicator:', error);
        }
      }
    );

    this.subscriptions.set('typing', subscription);
  }

  private subscribeToOnlineStatus(): void {
    if (!this.client) return;

    const subscription = this.client.subscribe(
      '/topic/online-status',
      (message: IMessage) => {
        try {
          const { userId, isOnline } = JSON.parse(message.body);
          store.dispatch(setUserOnlineStatus({ userId, isOnline }));
        } catch (error) {
          console.error('Error parsing online status:', error);
        }
      }
    );

    this.subscriptions.set('onlineStatus', subscription);
  }

  private handleWebSocketMessage(wsMessage: WebSocketMessage): void {
    switch (wsMessage.type) {
      case WebSocketMessageType.MESSAGE_SENT:
      case WebSocketMessageType.MESSAGE_RECEIVED:
        store.dispatch(addMessage(wsMessage.payload as Message));
        break;

      case WebSocketMessageType.MESSAGE_UPDATED:
        store.dispatch(updateMessageInState(wsMessage.payload as Message));
        break;

      case WebSocketMessageType.MESSAGE_DELETED:
        if (wsMessage.payload.messageId && wsMessage.conversationId) {
          store.dispatch(removeMessage({
            messageId: wsMessage.payload.messageId,
            conversationId: wsMessage.conversationId
          }));
        }
        break;

      case WebSocketMessageType.CONVERSATION_CREATED:
        store.dispatch(addConversation(wsMessage.payload as Conversation));
        break;

      case WebSocketMessageType.CONVERSATION_UPDATED:
        store.dispatch(updateConversation(wsMessage.payload as Conversation));
        break;

      case WebSocketMessageType.TYPING_START:
      case WebSocketMessageType.TYPING_STOP:
        store.dispatch(setTypingIndicator(wsMessage.payload as TypingIndicator));
        break;

      case WebSocketMessageType.USER_ONLINE:
        store.dispatch(setUserOnlineStatus({ 
          userId: wsMessage.userId!, 
          isOnline: true 
        }));
        break;

      case WebSocketMessageType.USER_OFFLINE:
        store.dispatch(setUserOnlineStatus({ 
          userId: wsMessage.userId!, 
          isOnline: false 
        }));
        break;

      default:
        console.warn('Unknown WebSocket message type:', wsMessage.type);
    }
  }

  sendTypingIndicator(conversationId: string, isTyping: boolean): void {
    if (!this.client || !this.isConnected) return;

    const userId = this.getCurrentUserId();
    if (!userId) return;

    this.client.publish({
      destination: '/app/typing',
      body: JSON.stringify({
        conversationId,
        userId,
        isTyping,
        timestamp: new Date()
      })
    });
  }

  joinConversation(conversationId: string): void {
    if (!this.client || !this.isConnected) return;

    const subscription = this.client.subscribe(
      `/topic/conversation/${conversationId}`,
      (message: IMessage) => {
        try {
          const wsMessage: WebSocketMessage = JSON.parse(message.body);
          this.handleWebSocketMessage(wsMessage);
        } catch (error) {
          console.error('Error parsing conversation message:', error);
        }
      }
    );

    this.subscriptions.set(`conversation-${conversationId}`, subscription);
  }

  leaveConversation(conversationId: string): void {
    const subscriptionKey = `conversation-${conversationId}`;
    const subscription = this.subscriptions.get(subscriptionKey);
    
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
    }
  }

  private clearSubscriptions(): void {
    this.subscriptions.forEach((subscription) => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    });
    this.subscriptions.clear();
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      if (!this.isConnected) {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }

  private getAuthToken(): string {
    const state = store.getState();
    return state.auth.token || '';
  }

  private getCurrentUserId(): string | null {
    const state = store.getState();
    return state.auth.user?.id?.toString() || null;
  }

  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  getConnectionState(): string {
    if (!this.client) return 'DISCONNECTED';
    return this.client.connected ? 'CONNECTED' : 'DISCONNECTED';
  }
}

export const messageWebSocketService = new MessageWebSocketService(); 