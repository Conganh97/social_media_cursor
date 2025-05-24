import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  getFeedAsync,
  getUserPostsAsync,
  getPostByIdAsync,
  createPostAsync,
  updatePostAsync,
  deletePostAsync,
  likePostAsync,
  unlikePostAsync,
  searchPostsAsync,
  clearError,
  clearCurrentPost,
  resetFeed,
  selectPosts,
  selectFeedPosts,
  selectCurrentPost,
  selectPostsLoading,
  selectPostsCreating,
  selectPostsError,
  selectHasMoreFeed,
  selectFeedPage,
  selectUserPosts,
} from '../store/postSlice';
import { CreatePostData, UpdatePostData, PostFilters } from '../types/post.types';

export interface UsePostReturn {
  // State
  posts: ReturnType<typeof selectPosts>;
  feedPosts: ReturnType<typeof selectFeedPosts>;
  currentPost: ReturnType<typeof selectCurrentPost>;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  hasMoreFeed: boolean;
  feedPage: number;
  
  // Actions
  getFeed: (params?: { page?: number; size?: number; refresh?: boolean }) => Promise<any>;
  getUserPosts: (userId: number, page?: number, size?: number) => Promise<any>;
  getPostById: (postId: number) => Promise<any>;
  createPost: (postData: CreatePostData) => Promise<any>;
  updatePost: (postId: number, data: UpdatePostData) => Promise<any>;
  deletePost: (postId: number) => Promise<any>;
  likePost: (postId: number) => Promise<any>;
  unlikePost: (postId: number) => Promise<any>;
  searchPosts: (query: string, filters?: PostFilters, page?: number, size?: number) => Promise<any>;
  clearError: () => void;
  clearCurrentPost: () => void;
  resetFeed: () => void;
  getUserPostsSelector: (userId: number) => any[];
}

export const usePost = (): UsePostReturn => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const posts = useAppSelector(selectPosts);
  const feedPosts = useAppSelector(selectFeedPosts);
  const currentPost = useAppSelector(selectCurrentPost);
  const isLoading = useAppSelector(selectPostsLoading);
  const isCreating = useAppSelector(selectPostsCreating);
  const error = useAppSelector(selectPostsError);
  const hasMoreFeed = useAppSelector(selectHasMoreFeed);
  const feedPage = useAppSelector(selectFeedPage);

  // Actions
  const getFeed = useCallback(
    (params?: { page?: number; size?: number; refresh?: boolean }) => {
      return dispatch(getFeedAsync(params || {}));
    },
    [dispatch]
  );

  const getUserPosts = useCallback(
    (userId: number, page?: number, size?: number) => {
      return dispatch(getUserPostsAsync({ userId, page, size }));
    },
    [dispatch]
  );

  const getPostById = useCallback(
    (postId: number) => {
      return dispatch(getPostByIdAsync(postId));
    },
    [dispatch]
  );

  const createPost = useCallback(
    (postData: CreatePostData) => {
      return dispatch(createPostAsync(postData));
    },
    [dispatch]
  );

  const updatePost = useCallback(
    (postId: number, data: UpdatePostData) => {
      return dispatch(updatePostAsync({ postId, data }));
    },
    [dispatch]
  );

  const deletePost = useCallback(
    (postId: number) => {
      return dispatch(deletePostAsync(postId));
    },
    [dispatch]
  );

  const likePost = useCallback(
    (postId: number) => {
      return dispatch(likePostAsync(postId));
    },
    [dispatch]
  );

  const unlikePost = useCallback(
    (postId: number) => {
      return dispatch(unlikePostAsync(postId));
    },
    [dispatch]
  );

  const searchPosts = useCallback(
    (query: string, filters?: PostFilters, page?: number, size?: number) => {
      return dispatch(searchPostsAsync({ query, filters, page, size }));
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearCurrentPost = useCallback(() => {
    dispatch(clearCurrentPost());
  }, [dispatch]);

  const handleResetFeed = useCallback(() => {
    dispatch(resetFeed());
  }, [dispatch]);

  const getUserPostsSelector = useCallback(
    (userId: number) => {
      return useAppSelector(selectUserPosts(userId));
    },
    []
  );

  return {
    // State
    posts,
    feedPosts,
    currentPost,
    isLoading,
    isCreating,
    error,
    hasMoreFeed,
    feedPage,
    
    // Actions
    getFeed,
    getUserPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    searchPosts,
    clearError: handleClearError,
    clearCurrentPost: handleClearCurrentPost,
    resetFeed: handleResetFeed,
    getUserPostsSelector,
  };
}; 