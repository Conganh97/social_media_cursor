export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  isPrivate: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  isFollowing?: boolean;
  isFollowedBy?: boolean;
  isFriend?: boolean;
  friendshipStatus?: FriendshipStatus;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  isPrivate?: boolean;
}

export interface UserSearch {
  query: string;
  page: number;
  limit: number;
  filters?: UserSearchFilters;
}

export interface UserSearchFilters {
  location?: string;
  verified?: boolean;
  hasAvatar?: boolean;
}

export interface UserState {
  currentUser: User | null;
  profiles: Record<number, UserProfile>;
  searchResults: {
    users: UserProfile[];
    totalCount: number;
    hasMore: boolean;
    isLoading: boolean;
    query: string;
  };
  isLoading: boolean;
  isUpdating: boolean;
  isUploading: boolean;
  error: string | null;
}

export interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  friendsCount: number;
}

export interface UserSettings {
  privacy: {
    isPrivate: boolean;
    showEmail: boolean;
    showPhone: boolean;
    showBirthDate: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    friendRequests: boolean;
    messages: boolean;
    posts: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
  };
}

export interface AvatarUpload {
  file: File;
  preview?: string;
}

export enum FriendshipStatus {
  NONE = 'NONE',
  PENDING_SENT = 'PENDING_SENT',
  PENDING_RECEIVED = 'PENDING_RECEIVED',
  FRIENDS = 'FRIENDS',
  BLOCKED = 'BLOCKED',
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  dateOfBirth: string;
  phoneNumber: string;
  isPrivate: boolean;
}

export interface UserFormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  general?: string;
} 