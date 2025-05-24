import { store } from '@/store';
import { setGlobalLoading, addToast } from '@/store';
import { apiService } from './apiService';
import { errorHandler } from './errorHandler';
import { ApiResponse, ToastMessage, ErrorResponse } from '@/shared/types';

class ReduxApiService {
  async get<T>(
    url: string,
    params?: Record<string, any>,
    options?: { showLoading?: boolean; showErrorToast?: boolean }
  ): Promise<ApiResponse<T>> {
    const { showLoading = false, showErrorToast = true } = options || {};

    if (showLoading) {
      store.dispatch(setGlobalLoading(true));
    }

    try {
      const response = await apiService.get<T>(url, params);
      return response;
    } catch (error: any) {
      if (showErrorToast) {
        this.handleErrorToast(error);
      }
      throw error;
    } finally {
      if (showLoading) {
        store.dispatch(setGlobalLoading(false));
      }
    }
  }

  async post<T>(
    url: string,
    data?: any,
    options?: { showLoading?: boolean; showErrorToast?: boolean; showSuccessToast?: boolean }
  ): Promise<ApiResponse<T>> {
    const { showLoading = true, showErrorToast = true, showSuccessToast = false } = options || {};

    if (showLoading) {
      store.dispatch(setGlobalLoading(true));
    }

    try {
      const response = await apiService.post<T>(url, data);
      
      if (showSuccessToast) {
        this.showSuccessToast('Operation completed successfully');
      }
      
      return response;
    } catch (error: any) {
      if (showErrorToast) {
        this.handleErrorToast(error);
      }
      throw error;
    } finally {
      if (showLoading) {
        store.dispatch(setGlobalLoading(false));
      }
    }
  }

  async put<T>(
    url: string,
    data?: any,
    options?: { showLoading?: boolean; showErrorToast?: boolean; showSuccessToast?: boolean }
  ): Promise<ApiResponse<T>> {
    const { showLoading = true, showErrorToast = true, showSuccessToast = false } = options || {};

    if (showLoading) {
      store.dispatch(setGlobalLoading(true));
    }

    try {
      const response = await apiService.put<T>(url, data);
      
      if (showSuccessToast) {
        this.showSuccessToast('Updated successfully');
      }
      
      return response;
    } catch (error: any) {
      if (showErrorToast) {
        this.handleErrorToast(error);
      }
      throw error;
    } finally {
      if (showLoading) {
        store.dispatch(setGlobalLoading(false));
      }
    }
  }

  async delete<T>(
    url: string,
    options?: { showLoading?: boolean; showErrorToast?: boolean; showSuccessToast?: boolean }
  ): Promise<ApiResponse<T>> {
    const { showLoading = true, showErrorToast = true, showSuccessToast = false } = options || {};

    if (showLoading) {
      store.dispatch(setGlobalLoading(true));
    }

    try {
      const response = await apiService.delete<T>(url);
      
      if (showSuccessToast) {
        this.showSuccessToast('Deleted successfully');
      }
      
      return response;
    } catch (error: any) {
      if (showErrorToast) {
        this.handleErrorToast(error);
      }
      throw error;
    } finally {
      if (showLoading) {
        store.dispatch(setGlobalLoading(false));
      }
    }
  }

  async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    options?: { showLoading?: boolean; showErrorToast?: boolean; showSuccessToast?: boolean }
  ): Promise<ApiResponse<T>> {
    const { showLoading = true, showErrorToast = true, showSuccessToast = true } = options || {};

    if (showLoading) {
      store.dispatch(setGlobalLoading(true));
    }

    try {
      const response = await apiService.upload<T>(url, file, onProgress);
      
      if (showSuccessToast) {
        this.showSuccessToast('File uploaded successfully');
      }
      
      return response;
    } catch (error: any) {
      if (showErrorToast) {
        this.handleErrorToast(error);
      }
      throw error;
    } finally {
      if (showLoading) {
        store.dispatch(setGlobalLoading(false));
      }
    }
  }

  private handleErrorToast(error: any): void {
    let toast: ToastMessage;

    if (errorHandler.isNetworkError(error)) {
      toast = errorHandler.createNetworkErrorToast();
    } else if (errorHandler.isTimeoutError(error)) {
      toast = errorHandler.createTimeoutErrorToast();
    } else if (error.response?.data) {
      toast = errorHandler.handleError(error.response.data as ErrorResponse);
    } else {
      toast = {
        id: `error_${Date.now()}`,
        type: 'error',
        title: 'Error',
        message: error.message || 'An unexpected error occurred',
        duration: 6000,
      };
    }

    store.dispatch(addToast(toast));
  }

  private showSuccessToast(message: string): void {
    const toast: ToastMessage = {
      id: `success_${Date.now()}`,
      type: 'success',
      title: 'Success',
      message,
      duration: 4000,
    };

    store.dispatch(addToast(toast));
  }
}

export const reduxApiService = new ReduxApiService(); 