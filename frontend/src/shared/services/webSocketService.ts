import { Client, IMessage, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface WebSocketConfig {
  brokerURL: string;
  reconnectDelay?: number;
  heartbeatIncoming?: number;
  heartbeatOutgoing?: number;
  debug?: boolean;
}

export interface WebSocketSubscription {
  id: string;
  destination: string;
  callback: (message: any) => void;
  unsubscribe: () => void;
}

export class WebSocketService {
  private client: Client | null = null;
  private config: WebSocketConfig;
  private subscriptions: Map<string, WebSocketSubscription> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connectionPromise: Promise<void> | null = null;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: false,
      ...config
    };
  }

  async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        // Create SockJS instance
        const socket = new SockJS(this.config.brokerURL);
        
        // Create STOMP client
        this.client = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: this.config.reconnectDelay,
          heartbeatIncoming: this.config.heartbeatIncoming,
          heartbeatOutgoing: this.config.heartbeatOutgoing,
          debug: this.config.debug ? (str) => console.log('[WebSocket Debug]', str) : undefined,
        });

        // Set up connection handlers
        this.client.onConnect = (frame: IFrame) => {
          console.log('[WebSocket] Connected:', frame);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.resubscribeAll();
          resolve();
        };

        this.client.onDisconnect = (frame: IFrame) => {
          console.log('[WebSocket] Disconnected:', frame);
          this.isConnected = false;
          this.handleReconnect();
        };

        this.client.onStompError = (frame: IFrame) => {
          console.error('[WebSocket] STOMP Error:', frame);
          this.isConnected = false;
          reject(new Error(`WebSocket STOMP Error: ${frame.body}`));
        };

        this.client.onWebSocketError = (error: Event) => {
          console.error('[WebSocket] WebSocket Error:', error);
          this.isConnected = false;
          reject(new Error('WebSocket connection error'));
        };

        // Activate the client
        this.client.activate();

      } catch (error) {
        console.error('[WebSocket] Connection failed:', error);
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.isConnected = false;
    this.subscriptions.clear();
    this.connectionPromise = null;
  }

  async subscribe(destination: string, callback: (message: any) => void): Promise<WebSocketSubscription> {
    await this.ensureConnected();

    if (!this.client) {
      throw new Error('WebSocket client not available');
    }

    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const stompSubscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error, message.body);
        callback(message.body);
      }
    });

    const subscription: WebSocketSubscription = {
      id: subscriptionId,
      destination,
      callback,
      unsubscribe: () => {
        stompSubscription.unsubscribe();
        this.subscriptions.delete(subscriptionId);
      }
    };

    this.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }

  async publish(destination: string, body: any, headers: any = {}): Promise<void> {
    await this.ensureConnected();

    if (!this.client) {
      throw new Error('WebSocket client not available');
    }

    const messageBody = typeof body === 'string' ? body : JSON.stringify(body);
    
    this.client.publish({
      destination,
      body: messageBody,
      headers
    });
  }

  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.config.reconnectDelay! * this.reconnectAttempts;
    
    console.log(`[WebSocket] Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connectionPromise = null;
      this.connect().catch(error => {
        console.error('[WebSocket] Reconnection failed:', error);
        this.handleReconnect();
      });
    }, delay);
  }

  private resubscribeAll(): void {
    if (!this.client) return;

    this.subscriptions.forEach((subscription) => {
      this.client!.subscribe(subscription.destination, (message: IMessage) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          subscription.callback(parsedMessage);
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error, message.body);
          subscription.callback(message.body);
        }
      });
    });
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getSubscriptionCount(): number {
    return this.subscriptions.size;
  }
}

// Singleton instance factory
let webSocketInstance: WebSocketService | null = null;

export const createWebSocketService = (config: WebSocketConfig): WebSocketService => {
  if (!webSocketInstance) {
    webSocketInstance = new WebSocketService(config);
  }
  return webSocketInstance;
};

export const getWebSocketService = (): WebSocketService | null => {
  return webSocketInstance;
}; 