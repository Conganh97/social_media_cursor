import { httpClient } from '@/shared/services/httpClient';
import { likeApi } from '@/modules/social/services';
import { 
  Post, 
  CreatePostData, 
  UpdatePostData, 
  FeedResponse, 
  PostFilters
} from '../types/post.types';

class PostApiService {
  private readonly baseUrl = '/posts';

  async getFeed(page: number = 0, size: number = 10): Promise<FeedResponse> {
    const response = await httpClient.get(`${this.baseUrl}/feed`, {
      params: { page, size }
    });
    return response.data as FeedResponse;
  }

  async getUserPosts(userId: number, page: number = 0, size: number = 10): Promise<FeedResponse> {
    const response = await httpClient.get(`${this.baseUrl}/user/${userId}`, {
      params: { page, size }
    });
    return response.data as FeedResponse;
  }

  async getPostById(postId: number): Promise<Post> {
    const response = await httpClient.get(`${this.baseUrl}/${postId}`);
    return response.data as Post;
  }

  async createPost(postData: CreatePostData): Promise<Post> {
    if (!postData.images || postData.images.length === 0) {
      const response = await httpClient.post(this.baseUrl, {
        content: postData.content,
        visibility: postData.visibility,
        location: postData.location,
        tags: postData.tags
      });
      return response.data as Post;
    }

    const formData = new FormData();
    formData.append('content', postData.content);
    
    if (postData.visibility) {
      formData.append('visibility', postData.visibility);
    }
    
    if (postData.location) {
      formData.append('location', postData.location);
    }
    
    if (postData.tags && postData.tags.length > 0) {
      postData.tags.forEach(tag => formData.append('tags', tag));
    }
    
    if (postData.images && postData.images.length > 0) {
      postData.images.forEach((image) => {
        formData.append(`images`, image);
      });
    }

    const response = await httpClient.post(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as Post;
  }

  async updatePost(postId: number, data: UpdatePostData): Promise<Post> {
    const response = await httpClient.put(`${this.baseUrl}/${postId}`, {
      content: data.content,
      visibility: data.visibility,
      location: data.location,
      tags: data.tags
    });
    return response.data as Post;
  }

  async deletePost(postId: number): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${postId}`);
  }

  async searchPosts(
    query: string, 
    filters?: PostFilters, 
    page: number = 0, 
    size: number = 10
  ): Promise<FeedResponse> {
    const params: any = { query, page, size };
    
    if (filters) {
      if (filters.userId) params.userId = filters.userId;
      if (filters.tag) params.tag = filters.tag;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.visibility) params.visibility = filters.visibility;
    }

    const response = await httpClient.get(`${this.baseUrl}/search`, { params });
    return response.data as FeedResponse;
  }

  async getRecentPosts(page: number = 0, size: number = 10): Promise<FeedResponse> {
    const response = await httpClient.get(`${this.baseUrl}/recent`, {
      params: { page, size }
    });
    return response.data as FeedResponse;
  }

  async getTrendingPosts(page: number = 0, size: number = 10): Promise<FeedResponse> {
    const response = await httpClient.get(`${this.baseUrl}/trending`, {
      params: { page, size }
    });
    return response.data as FeedResponse;
  }

  async getPostsByTag(tag: string, page: number = 0, size: number = 10): Promise<FeedResponse> {
    const response = await httpClient.get(`${this.baseUrl}/tag/${encodeURIComponent(tag)}`, {
      params: { page, size }
    });
    return response.data as FeedResponse;
  }

  async getPostCount(userId: number): Promise<{ count: number }> {
    const response = await httpClient.get(`${this.baseUrl}/count/user/${userId}`);
    return response.data as { count: number };
  }

  async reportPost(postId: number, reason: string): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/${postId}/report`, { reason });
    return response.data as { success: boolean; message: string };
  }

  async sharePost(postId: number): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.post(`${this.baseUrl}/${postId}/share`);
    return response.data as { success: boolean; message: string };
  }

  async bookmarkPost(postId: number): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.post(`/bookmarks/post/${postId}`);
    return response.data as { success: boolean; message: string };
  }

  async unbookmarkPost(postId: number): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.delete(`/bookmarks/post/${postId}`);
    return response.data as { success: boolean; message: string };
  }

  async getBookmarkedPosts(page: number = 0, size: number = 10): Promise<FeedResponse> {
    const response = await httpClient.get('/bookmarks/posts', {
      params: { page, size }
    });
    return response.data as FeedResponse;
  }

  get likes() {
    return likeApi;
  }
}

export const postApi = new PostApiService(); 