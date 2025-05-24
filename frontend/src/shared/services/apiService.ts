import { ApiResponse, PaginatedResponse, CacheConfig, RetryConfig } from '@/shared/types';
import { httpClient } from './httpClient';
import { cacheService } from './cacheService';
import { errorHandler } from './errorHandler';

interface ApiOptions {
  cache?: CacheConfig;
  retry?: RetryConfig;
  signal?: AbortSignal;
}

class ApiService {
  async get<T>(url: string, params?: Record<string, any>, options?: ApiOptions): Promise<ApiResponse<T>> {
    const cacheKey = options?.cache?.key || cacheService.createCacheKey(url, params);

    if (options?.cache?.enabled && cacheService.has(cacheKey)) {
      const cachedData = cacheService.get<T>(cacheKey);
      if (cachedData) {
        return {
          success: true,
          data: cachedData,
          timestamp: new Date().toISOString(),
        };
      }
    }

    try {
      const response = await this.executeWithRetry(
        () => httpClient.get<T>(url, { params, signal: options?.signal }),
        options?.retry
      );

      if (options?.cache?.enabled && response.data) {
        cacheService.set(cacheKey, response.data, options.cache.duration);
      }

      return response;
    } catch (error: any) {
      if (errorHandler.isNetworkError(error)) {
        throw errorHandler.createNetworkErrorToast();
      }
      if (errorHandler.isTimeoutError(error)) {
        throw errorHandler.createTimeoutErrorToast();
      }
      throw error;
    }
  }

  async post<T>(url: string, data?: any, options?: ApiOptions): Promise<ApiResponse<T>> {
    try {
      return await this.executeWithRetry(
        () => httpClient.post<T>(url, data, { signal: options?.signal }),
        options?.retry
      );
    } catch (error: any) {
      if (errorHandler.isNetworkError(error)) {
        throw errorHandler.createNetworkErrorToast();
      }
      if (errorHandler.isTimeoutError(error)) {
        throw errorHandler.createTimeoutErrorToast();
      }
      throw error;
    }
  }

  async put<T>(url: string, data?: any, options?: ApiOptions): Promise<ApiResponse<T>> {
    try {
      return await this.executeWithRetry(
        () => httpClient.put<T>(url, data, { signal: options?.signal }),
        options?.retry
      );
    } catch (error: any) {
      if (errorHandler.isNetworkError(error)) {
        throw errorHandler.createNetworkErrorToast();
      }
      if (errorHandler.isTimeoutError(error)) {
        throw errorHandler.createTimeoutErrorToast();
      }
      throw error;
    }
  }

  async patch<T>(url: string, data?: any, options?: ApiOptions): Promise<ApiResponse<T>> {
    try {
      return await this.executeWithRetry(
        () => httpClient.patch<T>(url, data, { signal: options?.signal }),
        options?.retry
      );
    } catch (error: any) {
      if (errorHandler.isNetworkError(error)) {
        throw errorHandler.createNetworkErrorToast();
      }
      if (errorHandler.isTimeoutError(error)) {
        throw errorHandler.createTimeoutErrorToast();
      }
      throw error;
    }
  }

  async delete<T>(url: string, options?: ApiOptions): Promise<ApiResponse<T>> {
    try {
      return await this.executeWithRetry(
        () => httpClient.delete<T>(url, { signal: options?.signal }),
        options?.retry
      );
    } catch (error: any) {
      if (errorHandler.isNetworkError(error)) {
        throw errorHandler.createNetworkErrorToast();
      }
      if (errorHandler.isTimeoutError(error)) {
        throw errorHandler.createTimeoutErrorToast();
      }
      throw error;
    }
  }

  async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    options?: ApiOptions
  ): Promise<ApiResponse<T>> {
    try {
      return await httpClient.upload<T>(url, file, onProgress);
    } catch (error: any) {
      if (errorHandler.isNetworkError(error)) {
        throw errorHandler.createNetworkErrorToast();
      }
      if (errorHandler.isTimeoutError(error)) {
        throw errorHandler.createTimeoutErrorToast();
      }
      throw error;
    }
  }

  async getPaginated<T>(
    url: string,
    params?: Record<string, any>,
    options?: ApiOptions
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    return this.get<PaginatedResponse<T>>(url, params, options);
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retryConfig?: RetryConfig
  ): Promise<T> {
    if (!retryConfig) {
      return operation();
    }

    let lastError: any;
    let delay = retryConfig.delay;

    for (let attempt = 0; attempt <= retryConfig.attempts; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;

        if (attempt === retryConfig.attempts) {
          break;
        }

        if (error.response?.status < 500) {
          break;
        }

        await this.delay(delay);

        if (retryConfig.backoff) {
          delay *= 2;
        }
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  invalidateCache(pattern?: string): void {
    if (pattern) {
      cacheService.invalidatePattern(pattern);
    } else {
      cacheService.clear();
    }
  }

  cleanupCache(): void {
    cacheService.cleanup();
  }
}

export const apiService = new ApiService(); 