import { ErrorResponse, ToastMessage } from '@/shared/types';

export type ErrorHandler = (error: ErrorResponse) => void;

class ErrorHandlerService {
  private handlers: Map<number, ErrorHandler> = new Map();
  private globalHandler?: ErrorHandler;

  registerErrorHandler(statusCode: number, handler: ErrorHandler): void {
    this.handlers.set(statusCode, handler);
  }

  registerGlobalErrorHandler(handler: ErrorHandler): void {
    this.globalHandler = handler;
  }

  handleError(error: ErrorResponse): ToastMessage {
    const specificHandler = this.handlers.get(error.status);
    
    if (specificHandler) {
      specificHandler(error);
    } else if (this.globalHandler) {
      this.globalHandler(error);
    }

    return this.createToastFromError(error);
  }

  private createToastFromError(error: ErrorResponse): ToastMessage {
    let type: ToastMessage['type'] = 'error';
    let title = 'Error';

    switch (error.status) {
      case 400:
        title = 'Bad Request';
        break;
      case 401:
        title = 'Unauthorized';
        type = 'warning';
        break;
      case 403:
        title = 'Forbidden';
        type = 'warning';
        break;
      case 404:
        title = 'Not Found';
        break;
      case 409:
        title = 'Conflict';
        break;
      case 422:
        title = 'Validation Error';
        break;
      case 429:
        title = 'Rate Limited';
        type = 'warning';
        break;
      case 500:
        title = 'Server Error';
        break;
      case 503:
        title = 'Service Unavailable';
        break;
      default:
        if (error.status >= 500) {
          title = 'Server Error';
        } else if (error.status >= 400) {
          title = 'Client Error';
        }
    }

    return {
      id: `error_${Date.now()}_${Math.random()}`,
      type,
      title,
      message: error.message,
      duration: type === 'error' ? 6000 : 4000,
    };
  }

  getFieldErrors(error: ErrorResponse): Record<string, string> {
    if (!error.errors) return {};

    return error.errors.reduce((acc, fieldError) => {
      acc[fieldError.field] = fieldError.message;
      return acc;
    }, {} as Record<string, string>);
  }

  isNetworkError(error: any): boolean {
    return !error.response && error.request;
  }

  isTimeoutError(error: any): boolean {
    return error.code === 'ECONNABORTED';
  }

  createNetworkErrorToast(): ToastMessage {
    return {
      id: `network_error_${Date.now()}`,
      type: 'error',
      title: 'Network Error',
      message: 'Please check your internet connection and try again.',
      duration: 6000,
    };
  }

  createTimeoutErrorToast(): ToastMessage {
    return {
      id: `timeout_error_${Date.now()}`,
      type: 'warning',
      title: 'Request Timeout',
      message: 'The request took too long to complete. Please try again.',
      duration: 4000,
    };
  }
}

export const errorHandler = new ErrorHandlerService(); 