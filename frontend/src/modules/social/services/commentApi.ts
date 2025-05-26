import { httpClient } from '@/shared/services/httpClient';
import { 
  CommentRequest, 
  CommentResponse,
  LikeCountResponse,
  PagedResponse 
} from '../types/social.types';

class CommentApiService {
  private readonly baseUrl = '/comments';

  async createComment(postId: number, data: CommentRequest): Promise<CommentResponse> {
    const response = await httpClient.post(`${this.baseUrl}/${postId}`, data);
    return response.data as CommentResponse;
  }

  async getCommentsByPost(postId: number, page: number = 0, size: number = 10): Promise<PagedResponse<CommentResponse>> {
    const response = await httpClient.get(`${this.baseUrl}/post/${postId}`, {
      params: { page, size }
    });
    return response.data as PagedResponse<CommentResponse>;
  }

  async updateComment(commentId: number, data: CommentRequest): Promise<CommentResponse> {
    const response = await httpClient.put(`${this.baseUrl}/${commentId}`, data);
    return response.data as CommentResponse;
  }

  async deleteComment(commentId: number): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${commentId}`);
  }

  async getCommentCount(postId: number): Promise<LikeCountResponse> {
    const response = await httpClient.get(`${this.baseUrl}/count/post/${postId}`);
    return response.data as LikeCountResponse;
  }

  async getRecentComments(postId: number, limit: number = 5): Promise<CommentResponse[]> {
    const response = await httpClient.get(`${this.baseUrl}/recent/post/${postId}`, {
      params: { limit }
    });
    return response.data as CommentResponse[];
  }
}

export const commentApi = new CommentApiService(); 