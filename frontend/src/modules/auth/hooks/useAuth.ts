import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  loginAsync, 
  registerAsync, 
  logoutAsync, 
  refreshTokenAsync,
  verifyEmailAsync,
  requestPasswordResetAsync,
  clearError,
  setUser,
  selectAuth,
  selectIsAuthenticated,
  selectUser,
  selectAuthLoading,
  selectAuthError
} from '../store/authSlice';
import { LoginCredentials, RegisterData } from '../types/auth.types';
import { authApi } from '../services/authApi';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = useCallback(
    (credentials: LoginCredentials) => {
      return dispatch(loginAsync(credentials));
    },
    [dispatch]
  );

  const register = useCallback(
    (userData: RegisterData) => {
      return dispatch(registerAsync(userData));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutAsync());
  }, [dispatch]);

  const refreshToken = useCallback(() => {
    return dispatch(refreshTokenAsync());
  }, [dispatch]);

  const verifyEmail = useCallback(
    (token: string) => {
      return dispatch(verifyEmailAsync(token));
    },
    [dispatch]
  );

  const requestPasswordReset = useCallback(
    (email: string) => {
      return dispatch(requestPasswordResetAsync(email));
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (token && !user) {
      try {
        const currentUser = await authApi.getCurrentUser();
        dispatch(setUser(currentUser));
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }, [dispatch, user]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !isAuthenticated && user) {
      dispatch(setUser(user));
    }
  }, [dispatch, isAuthenticated, user]);

  return {
    auth,
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
    verifyEmail,
    requestPasswordReset,
    clearError: clearAuthError,
    initializeAuth,
  };
}; 