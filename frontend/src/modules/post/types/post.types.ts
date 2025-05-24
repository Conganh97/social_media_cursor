export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface PostImage {
  id: number;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  width?: number;
  height?: number;
}

export interface Post {
  id: number;
  content: string;
  author: User;
  images: PostImage[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  tags: string[];
  location?: string;
  mentions: User[];
}

export interface CreatePostData {
  content: string;
  images?: File[];
  visibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  location?: string;
  tags?: string[];
}

export interface UpdatePostData {
  content?: string;
  visibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  location?: string;
  tags?: string[];
}

export interface PostFilters {
  userId?: number;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
  visibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
}

export interface PostsState {
  posts: Post[];
  feedPosts: Post[];
  userPosts: Record<number, Post[]>;
  currentPost: Post | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  hasMorePosts: boolean;
  hasMoreFeed: boolean;
  feedPage: number;
  feedSize: number;
  lastFeedUpdate: string | null;
}

export interface FeedResponse {
  posts: Post[];
  hasNext: boolean;
  totalElements: number;
  currentPage: number;
}

export interface PostInteraction {
  postId: number;
  type: 'LIKE' | 'UNLIKE' | 'BOOKMARK' | 'UNBOOKMARK';
  timestamp: string;
}

export interface PostComment {
  id: number;
  content: string;
  author: User;
  post: { id: number };
  parentComment?: { id: number };
  replies: PostComment[];
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  postId: number;
  parentCommentId?: number;
}

export interface PostStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  postsThisWeek: number;
  postsThisMonth: number;
}

export interface PostUpload {
  file: File;
  preview: string;
  progress: number;
  isUploading: boolean;
  error?: string;
}

export interface PostDraft {
  id: string;
  content: string;
  images: PostUpload[];
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  location?: string;
  tags: string[];
  lastSaved: string;
}

export type PostSortBy = 'RECENT' | 'POPULAR' | 'TRENDING' | 'OLDEST';

export interface PostSearchParams {
  query?: string;
  sortBy?: PostSortBy;
  filters?: PostFilters;
  page?: number;
  size?: number;
} 