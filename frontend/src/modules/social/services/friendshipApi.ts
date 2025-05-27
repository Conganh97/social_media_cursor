import { httpClient } from '@/shared/services/httpClient';
import { User } from '@/modules/user/types/user.types';
import { store } from '@/store';
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
    const response = await httpClient.get(`${this.baseUrl}/my-friends`, {
      params: { page, size }
    });
    
    const friendshipData = response.data as PagedResponse<FriendshipResponse>;
    const currentUserId = store.getState().auth.user?.id;
    
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }
    
    const friends = friendshipData.content.map((friendship) => {
      const friend = friendship.requester.id === currentUserId 
        ? friendship.addressee 
        : friendship.requester;
      
      return {
        id: friend.id,
        username: friend.username,
        firstName: friend.firstName || '',
        lastName: friend.lastName || '',
        email: '',
        bio: '',
        profilePictureUrl: friend.profileImageUrl,
        isEmailVerified: false,
        isPrivate: false,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as User;
    });
    
    return {
      content: friends,
      totalElements: friendshipData.totalElements,
      totalPages: friendshipData.totalPages,
      size: friendshipData.size,
      number: friendshipData.number,
      first: friendshipData.first,
      last: friendshipData.last
    };
  }

  async getPendingRequests(page: number = 0, size: number = 10): Promise<PagedResponse<FriendshipResponse>> {
    const response = await httpClient.get(`${this.baseUrl}/pending-requests`, {
      params: { page, size }
    });
    return response.data as PagedResponse<FriendshipResponse>;
  }

  async getSentRequests(page: number = 0, size: number = 10): Promise<PagedResponse<FriendshipResponse>> {
    const response = await httpClient.get(`${this.baseUrl}/sent-requests`, {
      params: { page, size }
    });
    return response.data as PagedResponse<FriendshipResponse>;
  }

  async getFriendshipStatus(userId: number): Promise<FriendshipStatusResponse> {
    const response = await httpClient.get(`${this.baseUrl}/status/${userId}`);
    return response.data as FriendshipStatusResponse;
  }

  async getFriendCount(): Promise<FriendCountResponse> {
    const currentUserId = store.getState().auth.user?.id;
    if (!currentUserId) {
      return { count: 0 };
    }
    
    const response = await httpClient.get(`${this.baseUrl}/count/friends/${currentUserId}`);
    return response.data as FriendCountResponse;
  }
}

export const friendshipApi = new FriendshipApiService(); 