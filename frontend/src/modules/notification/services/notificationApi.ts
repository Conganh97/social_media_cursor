import { apiService } from '../../../shared/services/apiService';
import {
  Notification,
  NotificationFilters,
  NotificationSettings,
  PaginatedNotificationResponse,
  CreateNotificationData,
  UpdateNotificationData
} from '../types/notification.types';

class NotificationApiService {
  private baseUrl = '/notifications';

  async getNotifications(filters?: NotificationFilters): Promise<PaginatedNotificationResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.type) params.append('type', filters.type);
      if (filters.isRead !== undefined) params.append('isRead', filters.isRead.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await apiService.get<PaginatedNotificationResponse>(url);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async getNotification(notificationId: string): Promise<Notification> {
    const response = await apiService.get<Notification>(`${this.baseUrl}/${notificationId}`);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await apiService.put(`${this.baseUrl}/${notificationId}/read`);
  }

  async markAsUnread(notificationId: string): Promise<void> {
    console.warn('markAsUnread is not supported by the backend');
  }

  async markAllAsRead(): Promise<void> {
    await apiService.put(`${this.baseUrl}/read-all`);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${notificationId}`);
  }

  async deleteAllNotifications(): Promise<void> {
    console.warn('deleteAllNotifications is not supported by the backend');
  }

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    const response = await apiService.get<{ unreadCount: number }>(`${this.baseUrl}/count/unread`);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async createNotification(data: CreateNotificationData): Promise<Notification> {
    console.warn('createNotification is not supported by the backend API');
    throw new Error('Creating notifications directly is not supported');
  }

  async updateNotification(notificationId: string, data: UpdateNotificationData): Promise<Notification> {
    console.warn('updateNotification is not supported by the backend');
    throw new Error('Updating notifications is not supported');
  }

  async getSettings(): Promise<NotificationSettings> {
    console.warn('getSettings is not supported by the backend, using default settings');
    return {
      emailNotifications: true,
      pushNotifications: true,
      likes: true,
      comments: true,
      friendRequests: true,
      messages: true,
      mentions: true,
      systemUpdates: true
    };
  }

  async updateSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    console.warn('updateSettings is not supported by the backend');
    return settings as NotificationSettings;
  }

  async testNotification(type: string): Promise<void> {
    await apiService.post(`${this.baseUrl}/test?type=${type}`);
  }

  async getNotificationsByType(type: string, filters?: NotificationFilters): Promise<PaginatedNotificationResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.isRead !== undefined) params.append('isRead', filters.isRead.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}/type/${type}?${queryString}` : `${this.baseUrl}/type/${type}`;
    
    const response = await apiService.get<PaginatedNotificationResponse>(url);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async bulkMarkAsRead(notificationIds: string[]): Promise<void> {
    console.warn('bulkMarkAsRead is not supported by the backend, marking individually');
    for (const id of notificationIds) {
      await this.markAsRead(id);
    }
  }

  async bulkDelete(notificationIds: string[]): Promise<void> {
    console.warn('bulkDelete is not supported by the backend, deleting individually');
    for (const id of notificationIds) {
      await this.deleteNotification(id);
    }
  }

  async subscribeToPush(subscription: PushSubscription): Promise<void> {
    console.warn('subscribeToPush is not supported by the backend');
  }

  async unsubscribeFromPush(): Promise<void> {
    console.warn('unsubscribeFromPush is not supported by the backend');
  }

  async getSummary(): Promise<any> {
    const response = await apiService.get(`${this.baseUrl}/summary`);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }
}

export const notificationApi = new NotificationApiService(); 