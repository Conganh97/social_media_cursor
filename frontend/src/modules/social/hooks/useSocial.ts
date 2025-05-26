import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
  fetchFriends,
  fetchFriendRequests,
  fetchSentRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  fetchFriendCount,
  fetchComments,
  createComment,
  deleteComment,
  toggleLike,
  fetchLikeStatus,
  fetchLikeCount,
  setError,
  clearError
} from '../store/socialSlice';
import { CommentRequest, FriendshipRequest } from '../types/social.types';

export const useSocial = () => {
  const dispatch = useDispatch<AppDispatch>();
  const social = useSelector((state: RootState) => state.social);

  const friendshipActions = {
    fetchFriends: (page?: number, size?: number) => 
      dispatch(fetchFriends({ page, size })),
    
    fetchFriendRequests: (page?: number, size?: number) => 
      dispatch(fetchFriendRequests({ page, size })),
    
    fetchSentRequests: (page?: number, size?: number) => 
      dispatch(fetchSentRequests({ page, size })),
    
    sendFriendRequest: (data: FriendshipRequest) => 
      dispatch(sendFriendRequest(data)),
    
    acceptFriendRequest: (friendshipId: number) => 
      dispatch(acceptFriendRequest(friendshipId)),
    
    rejectFriendRequest: (friendshipId: number) => 
      dispatch(rejectFriendRequest(friendshipId)),
    
    fetchFriendCount: () => 
      dispatch(fetchFriendCount())
  };

  const commentActions = {
    fetchComments: (postId: number, page?: number, size?: number) => 
      dispatch(fetchComments({ postId, page, size })),
    
    createComment: (postId: number, data: CommentRequest) => 
      dispatch(createComment({ postId, data })),
    
    deleteComment: (commentId: number, postId: number) => 
      dispatch(deleteComment({ commentId, postId }))
  };

  const likeActions = {
    toggleLike: (postId: number) => 
      dispatch(toggleLike(postId)),
    
    fetchLikeStatus: (postId: number) => 
      dispatch(fetchLikeStatus(postId)),
    
    fetchLikeCount: (postId: number) => 
      dispatch(fetchLikeCount(postId))
  };

  const utilityActions = {
    setError: (error: string | null) => 
      dispatch(setError(error)),
    
    clearError: () => 
      dispatch(clearError())
  };

  const getComments = (postId: number) => social.comments[postId] || [];
  const getLikeStatus = (postId: number) => social.likeStatus[postId] || false;
  const getLikeCount = (postId: number) => social.likeCounts[postId] || 0;

  return {
    ...social,
    friendship: friendshipActions,
    comments: commentActions,
    likes: likeActions,
    utils: utilityActions,
    getComments,
    getLikeStatus,
    getLikeCount
  };
}; 