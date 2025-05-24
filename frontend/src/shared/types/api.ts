export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  path?: string;
  errors?: FieldError[];
  correlationId?: string;
}

export interface FieldError {
  field: string;
  message: string;
  code?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  issuedAt: number;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  query?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ApiState<T = any> {
  data?: T;
  status: RequestStatus;
  error?: string | null;
  lastFetch?: number;
}

export interface CacheConfig {
  enabled: boolean;
  duration: number;
  key: string;
}

export interface RetryConfig {
  attempts: number;
  delay: number;
  backoff?: boolean;
} 