import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, addToast, removeToast, clearToasts, selectToasts } from '@/store';
import { ToastMessage } from '@/shared/types';
import { generateRandomId } from '@/shared/utils';

export interface UseToastReturn {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
  showSuccess: (message: string, title?: string) => string;
  showError: (message: string, title?: string) => string;
  showWarning: (message: string, title?: string) => string;
  showInfo: (message: string, title?: string) => string;
}

export function useToast(): UseToastReturn {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = generateRandomId();
    const fullToast: ToastMessage = {
      ...toast,
      id,
    };
    dispatch(addToast(fullToast));
    return id;
  }, [dispatch]);

  const hideToast = useCallback((id: string) => {
    dispatch(removeToast(id));
  }, [dispatch]);

  const clearAllToasts = useCallback(() => {
    dispatch(clearToasts());
  }, [dispatch]);

  const showSuccess = useCallback((message: string, title?: string) => {
    return showToast({
      type: 'success',
      title,
      message,
      duration: 4000,
    });
  }, [showToast]);

  const showError = useCallback((message: string, title?: string) => {
    return showToast({
      type: 'error',
      title,
      message,
      duration: 6000,
    });
  }, [showToast]);

  const showWarning = useCallback((message: string, title?: string) => {
    return showToast({
      type: 'warning',
      title,
      message,
      duration: 5000,
    });
  }, [showToast]);

  const showInfo = useCallback((message: string, title?: string) => {
    return showToast({
      type: 'info',
      title,
      message,
      duration: 4000,
    });
  }, [showToast]);

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
} 