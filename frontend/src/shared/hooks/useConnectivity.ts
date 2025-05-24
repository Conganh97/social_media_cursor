import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setOnlineStatus,
  setConnectionType,
  incrementRetryCount,
  resetRetryCount,
  updateLastSyncTime,
  addPendingRequest,
  removePendingRequest,
  clearPendingRequests,
  setNetworkSpeed,
  setSyncInProgress,
  selectConnectivity,
  selectIsOnline,
} from '@/store';

export interface UseConnectivityReturn {
  isOnline: boolean;
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  retryCount: number;
  lastSyncTime: number;
  pendingRequests: string[];
  networkSpeed: 'slow' | 'medium' | 'fast';
  syncInProgress: boolean;
  updateOnlineStatus: (status: boolean) => void;
  setType: (type: 'wifi' | 'cellular' | 'ethernet' | 'unknown') => void;
  retry: () => void;
  resetRetries: () => void;
  updateSync: () => void;
  addPending: (id: string) => void;
  removePending: (id: string) => void;
  clearPending: () => void;
  setSpeed: (speed: 'slow' | 'medium' | 'fast') => void;
  setSync: (inProgress: boolean) => void;
}

export function useConnectivity(): UseConnectivityReturn {
  const dispatch = useAppDispatch();
  const connectivity = useAppSelector(selectConnectivity);
  const isOnline = useAppSelector(selectIsOnline);

  const updateOnlineStatus = useCallback((status: boolean) => {
    dispatch(setOnlineStatus(status));
  }, [dispatch]);

  const setType = useCallback((type: 'wifi' | 'cellular' | 'ethernet' | 'unknown') => {
    dispatch(setConnectionType(type));
  }, [dispatch]);

  const retry = useCallback(() => {
    dispatch(incrementRetryCount());
  }, [dispatch]);

  const resetRetries = useCallback(() => {
    dispatch(resetRetryCount());
  }, [dispatch]);

  const updateSync = useCallback(() => {
    dispatch(updateLastSyncTime());
  }, [dispatch]);

  const addPending = useCallback((id: string) => {
    dispatch(addPendingRequest(id));
  }, [dispatch]);

  const removePending = useCallback((id: string) => {
    dispatch(removePendingRequest(id));
  }, [dispatch]);

  const clearPending = useCallback(() => {
    dispatch(clearPendingRequests());
  }, [dispatch]);

  const setSpeed = useCallback((speed: 'slow' | 'medium' | 'fast') => {
    dispatch(setNetworkSpeed(speed));
  }, [dispatch]);

  const setSync = useCallback((inProgress: boolean) => {
    dispatch(setSyncInProgress(inProgress));
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => updateOnlineStatus(true);
    const handleOffline = () => updateOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [updateOnlineStatus]);

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const updateConnection = () => {
        const effectiveType = connection.effectiveType;
        if (effectiveType === '4g') {
          setSpeed('fast');
        } else if (effectiveType === '3g') {
          setSpeed('medium');
        } else {
          setSpeed('slow');
        }
      };

      updateConnection();
      connection.addEventListener('change', updateConnection);

      return () => {
        connection.removeEventListener('change', updateConnection);
      };
    }
  }, [setSpeed]);

  return {
    isOnline,
    connectionType: connectivity.connectionType,
    retryCount: connectivity.retryCount,
    lastSyncTime: connectivity.lastSyncTime,
    pendingRequests: connectivity.pendingRequests,
    networkSpeed: connectivity.networkSpeed,
    syncInProgress: connectivity.syncInProgress,
    updateOnlineStatus,
    setType,
    retry,
    resetRetries,
    updateSync,
    addPending,
    removePending,
    clearPending,
    setSpeed,
    setSync,
  };
} 