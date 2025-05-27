import { User } from '@/modules/user/types/user.types';

export interface CommentRequest {
  content: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  postId: number;
}

export interface LikeResponse {
  id: number;
  postId: number;
  user: User;
  createdAt: string;
}

export interface LikePostResponse {
  message: string;
  liked: boolean;
  likeCount: number;
}

export interface UnlikePostResponse {
  message: string;
  unliked: boolean;
  likeCount: number;
}

export interface LikeStatusResponse {
  isLiked: boolean;
  likeCount: number;
}

export interface LikeCountResponse {
  count: number;
}

export interface LikeToggleResponse {
  message: string;
  action: string;
  success: boolean;
  likeCount: number;
  isLiked: boolean;
}

export interface LikedUsersResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface UserSummaryResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}

export interface FriendshipRequest {
  targetUserId: number;
}

export interface FriendshipResponse {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  updatedAt: string;
  requester: UserSummaryResponse;
  addressee: UserSummaryResponse;
}

export type FriendshipStatus = 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'FRIENDS';

export interface FriendshipStatusResponse {
  status: FriendshipStatus;
}

export interface FriendCountResponse {
  count: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
} 