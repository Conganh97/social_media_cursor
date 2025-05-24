export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimestampEntity {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
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

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  hasErrors: boolean;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
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

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
}

export interface FilterOption<T = any> {
  key: string;
  value: T;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export interface ConfirmDialogProps extends ModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'info' | 'warning' | 'error';
} 