import { httpClient } from '@/shared/services/httpClient';
import { User } from '@/modules/user/types/user.types';
import { 
  FriendshipRequest, 
  FriendshipResponse,
  FriendshipStatusResponse,
  FriendCountResponse,
  PagedResponse
} from '../types/social.types';

class FriendshipApiService {
  private readonly baseUrl = '/friendships';

  async sendFriendRequest(data: FriendshipRequest): Promise<FriendshipResponse> {
    const response = await httpClient.post(`${this.baseUrl}/request`, data);
    return response.data as FriendshipResponse;
  }

  async acceptFriendRequest(friendshipId: number): Promise<FriendshipResponse> {
    const response = await httpClient.put(`${this.baseUrl}/${friendshipId}/accept`);
    return response.data as FriendshipResponse;
  }

  async rejectFriendRequest(friendshipId: number): Promise<FriendshipResponse> {
    const response = await httpClient.put(`${this.baseUrl}/${friendshipId}/reject`);
    return response.data as FriendshipResponse;
  }

  async getFriends(page: number = 0, size: number = 10): Promise<PagedResponse<User>> {
    const response = await httpClient.get(`${this.baseUrl}/friends`, {
      params: { page, size }
    });
    return response.data as PagedResponse<User>;
  }

  async getPendingRequests(page: number = 0, size: number = 10): Promise<PagedResponse<FriendshipResponse>> {
    const response = await httpClient.get(`${this.baseUrl}/pending`, {
      params: { page, size }
    });
    return response.data as PagedResponse<FriendshipResponse>;
  }

  async getSentRequests(page: number = 0, size: number = 10): Promise<PagedResponse<FriendshipResponse>> {
    const response = await httpClient.get(`${this.baseUrl}/sent`, {
      params: { page, size }
    });
    return response.data as PagedResponse<FriendshipResponse>;
  }

  async getFriendshipStatus(userId: number): Promise<FriendshipStatusResponse> {
    const response = await httpClient.get(`${this.baseUrl}/status/${userId}`);
    return response.data as FriendshipStatusResponse;
  }

  async getFriendCount(): Promise<FriendCountResponse> {
    const response = await httpClient.get(`${this.baseUrl}/count`);
    return response.data as FriendCountResponse;
  }
}

export const friendshipApi = new FriendshipApiService(); 