import { httpClient } from '@/shared/services/httpClient';
import { 
  User, 
  UserProfile, 
  UpdateUserData, 
  UserSearch, 
  UserSettings,
  UserStats 
} from '../types/user.types';

class UserApiService {
  private readonly baseUrl = '/users';

  async getCurrentUser(): Promise<User> {
    const response = await httpClient.get(`${this.baseUrl}/me`);
    return response.data as User;
  }

  async getUserProfile(userId: number): Promise<UserProfile> {
    const response = await httpClient.get(`${this.baseUrl}/${userId}`);
    return response.data as UserProfile;
  }

  async updateProfile(userData: UpdateUserData): Promise<User> {
    const response = await httpClient.put(`${this.baseUrl}/me`, userData);
    return response.data as User;
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await httpClient.post(`${this.baseUrl}/me/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as { avatarUrl: string };
  }

  async deleteAvatar(): Promise<{ message: string }> {
    const response = await httpClient.delete(`${this.baseUrl}/me/avatar`);
    return response.data as { message: string };
  }

  async searchUsers(searchParams: UserSearch): Promise<{
    users: UserProfile[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const { query, page, limit, filters } = searchParams;
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      if (filters.location) params.append('location', filters.location);
      if (filters.verified !== undefined) params.append('verified', filters.verified.toString());
      if (filters.hasAvatar !== undefined) params.append('hasAvatar', filters.hasAvatar.toString());
    }

    const response = await httpClient.get(`${this.baseUrl}/search?${params}`);
    return response.data as { users: UserProfile[]; totalCount: number; hasMore: boolean };
  }

  async getUserStats(userId: number): Promise<UserStats> {
    const response = await httpClient.get(`${this.baseUrl}/${userId}/stats`);
    return response.data as UserStats;
  }

  async getUserSettings(): Promise<UserSettings> {
    const response = await httpClient.get(`${this.baseUrl}/me/settings`);
    return response.data as UserSettings;
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const response = await httpClient.put(`${this.baseUrl}/me/settings`, settings);
    return response.data as UserSettings;
  }

  async followUser(userId: number): Promise<{ message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/${userId}/follow`);
    return response.data as { message: string };
  }

  async unfollowUser(userId: number): Promise<{ message: string }> {
    const response = await httpClient.delete(`${this.baseUrl}/${userId}/follow`);
    return response.data as { message: string };
  }

  async getFollowers(userId: number, page = 1, limit = 20): Promise<{
    users: UserProfile[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const response = await httpClient.get(`${this.baseUrl}/${userId}/followers?page=${page}&limit=${limit}`);
    return response.data as { users: UserProfile[]; totalCount: number; hasMore: boolean };
  }

  async getFollowing(userId: number, page = 1, limit = 20): Promise<{
    users: UserProfile[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const response = await httpClient.get(`${this.baseUrl}/${userId}/following?page=${page}&limit=${limit}`);
    return response.data as { users: UserProfile[]; totalCount: number; hasMore: boolean };
  }

  async blockUser(userId: number): Promise<{ message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/${userId}/block`);
    return response.data as { message: string };
  }

  async unblockUser(userId: number): Promise<{ message: string }> {
    const response = await httpClient.delete(`${this.baseUrl}/${userId}/block`);
    return response.data as { message: string };
  }

  async reportUser(userId: number, reason: string, description?: string): Promise<{ message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/${userId}/report`, {
      reason,
      description,
    });
    return response.data as { message: string };
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await httpClient.put(`${this.baseUrl}/me/password`, {
      currentPassword,
      newPassword,
    });
    return response.data as { message: string };
  }

  async deleteAccount(password: string): Promise<{ message: string }> {
    const response = await httpClient.delete(`${this.baseUrl}/me`, {
      data: { password },
    });
    return response.data as { message: string };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/verify-email`, { token });
    return response.data as { message: string };
  }

  async resendVerificationEmail(): Promise<{ message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/resend-verification`);
    return response.data as { message: string };
  }
}

export const userApi = new UserApiService(); 