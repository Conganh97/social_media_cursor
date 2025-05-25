import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiState, CacheConfig, RetryConfig } from '@/shared/types';
import { apiService } from '@/shared/services/apiService';

interface UseApiOptions {
  cache?: CacheConfig;
  retry?: RetryConfig;
  immediate?: boolean;
}

export function useApi<T = any>(
  url: string,
  options?: UseApiOptions
) {
  const [state, setState] = useState<ApiState<T>>({
    status: 'idle',
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (params?: Record<string, any>) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      status: 'loading',
      error: null,
    }));

    try {
      const response = await apiService.get<T>(url, params, {
        ...options,
        signal: abortControllerRef.current.signal,
      });

      setState({
        data: response.data,
        status: 'succeeded',
        error: null,
        lastFetch: Date.now(),
      });

      return response;
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          status: 'failed',
          error: error.message || 'An error occurred',
        }));
      }
      throw error;
    }
  }, [url, options]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      status: 'idle',
      error: null,
    });
  }, []);

  useEffect(() => {
    if (options?.immediate) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute, options?.immediate]);

  return {
    ...state,
    execute,
    reset,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'succeeded',
    isError: state.status === 'failed',
    isIdle: state.status === 'idle',
  };
} 