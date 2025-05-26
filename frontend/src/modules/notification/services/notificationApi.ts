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
    await apiService.patch(`${this.baseUrl}/${notificationId}/read`);
  }

  async markAsUnread(notificationId: string): Promise<void> {
    await apiService.patch(`${this.baseUrl}/${notificationId}/unread`);
  }

  async markAllAsRead(): Promise<void> {
    await apiService.patch(`${this.baseUrl}/mark-all-read`);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${notificationId}`);
  }

  async deleteAllNotifications(): Promise<void> {
    await apiService.delete(`${this.baseUrl}/all`);
  }

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiService.get<{ count: number }>(`${this.baseUrl}/unread-count`);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const response = await apiService.post<Notification>(this.baseUrl, data);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async updateNotification(notificationId: string, data: UpdateNotificationData): Promise<Notification> {
    const response = await apiService.patch<Notification>(`${this.baseUrl}/${notificationId}`, data);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async getSettings(): Promise<NotificationSettings> {
    const response = await apiService.get<NotificationSettings>(`${this.baseUrl}/settings`);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async updateSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const response = await apiService.patch<NotificationSettings>(`${this.baseUrl}/settings`, settings);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async testNotification(type: string): Promise<void> {
    await apiService.post(`${this.baseUrl}/test`, { type });
  }

  async getNotificationsByType(type: string, filters?: NotificationFilters): Promise<PaginatedNotificationResponse> {
    const params = new URLSearchParams();
    params.append('type', type);
    
    if (filters) {
      if (filters.isRead !== undefined) params.append('isRead', filters.isRead.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
    }

    const response = await apiService.get<PaginatedNotificationResponse>(`${this.baseUrl}/type?${params.toString()}`);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async bulkMarkAsRead(notificationIds: string[]): Promise<void> {
    await apiService.patch(`${this.baseUrl}/bulk-read`, { notificationIds });
  }

  async bulkDelete(notificationIds: string[]): Promise<void> {
    await apiService.post(`${this.baseUrl}/bulk-delete`, { notificationIds });
  }

  async subscribeToPush(subscription: PushSubscription): Promise<void> {
    await apiService.post(`${this.baseUrl}/push-subscription`, subscription);
  }

  async unsubscribeFromPush(): Promise<void> {
    await apiService.delete(`${this.baseUrl}/push-subscription`);
  }
}

export const notificationApi = new NotificationApiService(); 