import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/modules/user/types/user.types';
import { 
  CommentResponse, 
  FriendshipResponse, 
  CommentRequest,
  FriendshipRequest
} from '../types/social.types';
import { socialApi } from '../services';

interface SocialState {
  loading: boolean;
  error: string | null;
  friends: User[];
  friendRequests: FriendshipResponse[];
  sentRequests: FriendshipResponse[];
  comments: { [postId: number]: CommentResponse[] };
  likeStatus: { [postId: number]: boolean };
  likeCounts: { [postId: number]: number };
  friendCount: number;
}

const initialState: SocialState = {
  loading: false,
  error: null,
  friends: [],
  friendRequests: [],
  sentRequests: [],
  comments: {},
  likeStatus: {},
  likeCounts: {},
  friendCount: 0
};

export const fetchFriends = createAsyncThunk(
  'social/fetchFriends',
  async (params: { page?: number; size?: number } = {}) => {
    const { page = 0, size = 10 } = params;
    return await socialApi.friendships.getFriends(page, size);
  }
);

export const fetchFriendRequests = createAsyncThunk(
  'social/fetchFriendRequests',
  async (params: { page?: number; size?: number } = {}) => {
    const { page = 0, size = 10 } = params;
    return await socialApi.friendships.getPendingRequests(page, size);
  }
);

export const fetchSentRequests = createAsyncThunk(
  'social/fetchSentRequests',
  async (params: { page?: number; size?: number } = {}) => {
    const { page = 0, size = 10 } = params;
    return await socialApi.friendships.getSentRequests(page, size);
  }
);

export const sendFriendRequest = createAsyncThunk(
  'social/sendFriendRequest',
  async (data: FriendshipRequest) => {
    return await socialApi.friendships.sendFriendRequest(data);
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'social/acceptFriendRequest',
  async (friendshipId: number) => {
    return await socialApi.friendships.acceptFriendRequest(friendshipId);
  }
);

export const rejectFriendRequest = createAsyncThunk(
  'social/rejectFriendRequest',
  async (friendshipId: number) => {
    return await socialApi.friendships.rejectFriendRequest(friendshipId);
  }
);

export const fetchFriendCount = createAsyncThunk(
  'social/fetchFriendCount',
  async () => {
    return await socialApi.friendships.getFriendCount();
  }
);

export const fetchComments = createAsyncThunk(
  'social/fetchComments',
  async (params: { postId: number; page?: number; size?: number }) => {
    const { postId, page = 0, size = 10 } = params;
    const response = await socialApi.comments.getCommentsByPost(postId, page, size);
    return { postId, comments: response };
  }
);

export const createComment = createAsyncThunk(
  'social/createComment',
  async (params: { postId: number; data: CommentRequest }) => {
    const { postId, data } = params;
    const comment = await socialApi.comments.createComment(postId, data);
    return { postId, comment };
  }
);

export const deleteComment = createAsyncThunk(
  'social/deleteComment',
  async (params: { commentId: number; postId: number }) => {
    const { commentId, postId } = params;
    await socialApi.comments.deleteComment(commentId);
    return { commentId, postId };
  }
);

export const toggleLike = createAsyncThunk(
  'social/toggleLike',
  async (postId: number) => {
    const response = await socialApi.likes.toggleLike(postId);
    return { postId, ...response };
  }
);

export const fetchLikeStatus = createAsyncThunk(
  'social/fetchLikeStatus',
  async (postId: number) => {
    const response = await socialApi.likes.checkLikeStatus(postId);
    return { postId, isLiked: response.isLiked, likeCount: response.likeCount };
  }
);

export const fetchLikeCount = createAsyncThunk(
  'social/fetchLikeCount',
  async (postId: number) => {
    const response = await socialApi.likes.getLikeCount(postId);
    return { postId, count: response.count };
  }
);

export const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateLikeStatus: (state, action: PayloadAction<{ postId: number; isLiked: boolean; count: number }>) => {
      const { postId, isLiked, count } = action.payload;
      state.likeStatus[postId] = isLiked;
      state.likeCounts[postId] = count;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload.content;
        state.friendCount = action.payload.content.length;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch friends';
      })
      
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.friendRequests = action.payload.content;
      })
      
      .addCase(fetchSentRequests.fulfilled, (state, action) => {
        state.sentRequests = action.payload.content;
      })
      
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.sentRequests.push(action.payload);
      })
      
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.friendRequests = state.friendRequests.filter(req => req.id !== action.payload.id);
        if (action.payload.requester) {
          state.friends.push(action.payload.requester);
        }
      })
      
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.friendRequests = state.friendRequests.filter(req => req.id !== action.payload.id);
      })
      
      .addCase(fetchFriendCount.fulfilled, (state, action) => {
        state.friendCount = action.payload.count;
      })
      
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.comments[postId] = comments.content;
      })
      
      .addCase(createComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.comments[postId]) {
          state.comments[postId] = [];
        }
        state.comments[postId].unshift(comment);
      })
      
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId, postId } = action.payload;
        if (state.comments[postId]) {
          state.comments[postId] = state.comments[postId].filter(comment => comment.id !== commentId);
        }
      })
      
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, isLiked, likeCount } = action.payload;
        state.likeStatus[postId] = isLiked;
        state.likeCounts[postId] = likeCount;
      })
      
      .addCase(fetchLikeStatus.fulfilled, (state, action) => {
        const { postId, isLiked, likeCount } = action.payload;
        state.likeStatus[postId] = isLiked;
        if (likeCount !== undefined) {
          state.likeCounts[postId] = likeCount;
        }
      })
      
      .addCase(fetchLikeCount.fulfilled, (state, action) => {
        const { postId, count } = action.payload;
        state.likeCounts[postId] = count;
      });
  }
});

export const { setLoading, setError, clearError, updateLikeStatus } = socialSlice.actions;
export default socialSlice.reducer; 