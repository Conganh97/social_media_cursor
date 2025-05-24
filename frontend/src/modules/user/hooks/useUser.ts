import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  getCurrentUserAsync,
  getUserProfileAsync,
  updateUserProfileAsync,
  uploadAvatarAsync,
  followUserAsync,
  unfollowUserAsync,
  deleteUserAccountAsync,
  clearError,
  selectCurrentUser,
  selectUserProfile,
  selectUserLoading,
  selectUserUpdating,
  selectUserUploading,
  selectUserError,
} from '../store/userSlice';
import { UpdateUserData } from '../types/user.types';

export const useUser = (userId?: number) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const userProfile = useAppSelector(userId ? selectUserProfile(userId) : () => null);
  const isLoading = useAppSelector(selectUserLoading);
  const isUpdating = useAppSelector(selectUserUpdating);
  const isUploading = useAppSelector(selectUserUploading);
  const error = useAppSelector(selectUserError);

  const getCurrentUser = useCallback(() => {
    return dispatch(getCurrentUserAsync());
  }, [dispatch]);

  const getUserProfile = useCallback((targetUserId: number) => {
    return dispatch(getUserProfileAsync(targetUserId));
  }, [dispatch]);

  const updateProfile = useCallback((userData: UpdateUserData) => {
    return dispatch(updateUserProfileAsync(userData));
  }, [dispatch]);

  const uploadAvatar = useCallback((file: File) => {
    return dispatch(uploadAvatarAsync(file));
  }, [dispatch]);

  const followUser = useCallback((targetUserId: number) => {
    return dispatch(followUserAsync(targetUserId));
  }, [dispatch]);

  const unfollowUser = useCallback((targetUserId: number) => {
    return dispatch(unfollowUserAsync(targetUserId));
  }, [dispatch]);

  const deleteAccount = useCallback((password: string) => {
    return dispatch(deleteUserAccountAsync(password));
  }, [dispatch]);

  const clearUserError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (!currentUser && !isLoading) {
      getCurrentUser();
    }
  }, [currentUser, isLoading, getCurrentUser]);

  useEffect(() => {
    if (userId && !userProfile && !isLoading) {
      getUserProfile(userId);
    }
  }, [userId, userProfile, isLoading, getUserProfile]);

  return {
    currentUser,
    userProfile,
    isLoading,
    isUpdating,
    isUploading,
    error,
    getCurrentUser,
    getUserProfile,
    updateProfile,
    uploadAvatar,
    followUser,
    unfollowUser,
    deleteAccount,
    clearError: clearUserError,
  };
}; 