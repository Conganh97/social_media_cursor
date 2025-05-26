import { httpClient } from '@/shared/services/httpClient';
import { 
  LikePostResponse,
  UnlikePostResponse,
  LikeStatusResponse,
  LikeCountResponse,
  LikeToggleResponse,
  LikedUsersResponse
} from '../types/social.types';

class LikeApiService {
  private readonly baseUrl = '/likes';

  async likePost(postId: number): Promise<LikePostResponse> {
    const response = await httpClient.post(`${this.baseUrl}/post/${postId}`);
    return response.data as LikePostResponse;
  }

  async unlikePost(postId: number): Promise<UnlikePostResponse> {
    const response = await httpClient.delete(`${this.baseUrl}/post/${postId}`);
    return response.data as UnlikePostResponse;
  }

  async toggleLike(postId: number): Promise<LikeToggleResponse> {
    const response = await httpClient.post(`${this.baseUrl}/post/${postId}/toggle`);
    return response.data as LikeToggleResponse;
  }

  async checkLikeStatus(postId: number): Promise<LikeStatusResponse> {
    const response = await httpClient.get(`${this.baseUrl}/post/${postId}/status`);
    return response.data as LikeStatusResponse;
  }

  async getLikedUsers(postId: number, page: number = 0, size: number = 10): Promise<LikedUsersResponse> {
    const response = await httpClient.get(`${this.baseUrl}/post/${postId}`, {
      params: { page, size }
    });
    return response.data as LikedUsersResponse;
  }

  async getLikeCount(postId: number): Promise<LikeCountResponse> {
    const response = await httpClient.get(`${this.baseUrl}/count/post/${postId}`);
    return response.data as LikeCountResponse;
  }
}

export const likeApi = new LikeApiService(); 