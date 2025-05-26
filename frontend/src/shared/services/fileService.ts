import { httpClient } from './httpClient';
import { ENDPOINTS } from '../constants/endpoints';

export interface FileUploadResponse {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class FileService {
  async uploadFile(
    file: File, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post<FileUploadResponse>(
      ENDPOINTS.FILES.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            });
          }
        },
      }
    );

    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async uploadProfileImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post<FileUploadResponse>(
      ENDPOINTS.FILES.UPLOAD_PROFILE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            });
          }
        },
      }
    );

    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async uploadPostImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post<FileUploadResponse>(
      ENDPOINTS.FILES.UPLOAD_POST,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            });
          }
        },
      }
    );

    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async uploadMultipleFiles(
    files: File[],
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<FileUploadResponse[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, (progress) => {
        if (onProgress) {
          onProgress(index, progress);
        }
      })
    );

    return Promise.all(uploadPromises);
  }

  async deleteFile(fileId: string): Promise<void> {
    await httpClient.delete(ENDPOINTS.FILES.DELETE(fileId));
  }

  validateFile(file: File, options?: {
    maxSize?: number;
    allowedTypes?: string[];
    maxWidth?: number;
    maxHeight?: number;
  }): { isValid: boolean; error?: string } {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxWidth = 4096,
      maxHeight = 4096,
    } = options || {};

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    // For images, validate dimensions
    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (img.width > maxWidth || img.height > maxHeight) {
            resolve({
              isValid: false,
              error: `Image dimensions must be less than ${maxWidth}x${maxHeight}px`,
            });
          } else {
            resolve({ isValid: true });
          }
        };
        img.onerror = () => {
          resolve({
            isValid: false,
            error: 'Invalid image file',
          });
        };
        img.src = URL.createObjectURL(file);
      }) as any;
    }

    return { isValid: true };
  }

  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const fileService = new FileService(); 