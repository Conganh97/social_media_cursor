export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface FormState<T> extends LoadingState {
  data: T;
  isDirty: boolean;
  isValid: boolean;
}

export type Theme = 'light' | 'dark' | 'system';

export type NotificationType = 'LIKE' | 'COMMENT' | 'FRIEND_REQUEST' | 'FRIEND_ACCEPT' | 'MESSAGE';

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
} 