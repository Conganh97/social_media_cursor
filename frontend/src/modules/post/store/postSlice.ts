import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, PostsState, CreatePostData, UpdatePostData, FeedResponse, PostFilters } from '../types/post.types';
import { postApi } from '../services/postApi';

const initialState: PostsState = {
  posts: [],
  feedPosts: [],
  userPosts: {},
  currentPost: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  hasMorePosts: true,
  hasMoreFeed: true,
  feedPage: 0,
  feedSize: 10,
  lastFeedUpdate: null,
};

export const getFeedAsync = createAsyncThunk(
  'posts/getFeed',
  async (params: { page?: number; size?: number; refresh?: boolean }, { rejectWithValue }) => {
    try {
      const response = await postApi.getFeed(params.page || 0, params.size || 10);
      return { ...response, refresh: params.refresh || false };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load feed');
    }
  }
);

export const getUserPostsAsync = createAsyncThunk(
  'posts/getUserPosts',
  async (params: { userId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await postApi.getUserPosts(params.userId, params.page || 0, params.size || 10);
      return { ...response, userId: params.userId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load user posts');
    }
  }
);

export const getPostByIdAsync = createAsyncThunk(
  'posts/getPostById',
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await postApi.getPostById(postId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load post');
    }
  }
);

export const createPostAsync = createAsyncThunk(
  'posts/createPost',
  async (postData: CreatePostData, { rejectWithValue }) => {
    try {
      const response = await postApi.createPost(postData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const updatePostAsync = createAsyncThunk(
  'posts/updatePost',
  async (params: { postId: number; data: UpdatePostData }, { rejectWithValue }) => {
    try {
      const response = await postApi.updatePost(params.postId, params.data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);

export const deletePostAsync = createAsyncThunk(
  'posts/deletePost',
  async (postId: number, { rejectWithValue }) => {
    try {
      await postApi.deletePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const likePostAsync = createAsyncThunk(
  'posts/likePost',
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await postApi.likePost(postId);
      return { postId, ...response };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const unlikePostAsync = createAsyncThunk(
  'posts/unlikePost',
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await postApi.unlikePost(postId);
      return { postId, ...response };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike post');
    }
  }
);

export const searchPostsAsync = createAsyncThunk(
  'posts/searchPosts',
  async (params: { query: string; filters?: PostFilters; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await postApi.searchPosts(params.query, params.filters, params.page || 0, params.size || 10);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search posts');
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    updatePostInState: (state, action: PayloadAction<Post>) => {
      const updatedPost = action.payload;
      
      // Update in posts array
      const postIndex = state.posts.findIndex(p => p.id === updatedPost.id);
      if (postIndex !== -1) {
        state.posts[postIndex] = updatedPost;
      }
      
      // Update in feed posts
      const feedIndex = state.feedPosts.findIndex(p => p.id === updatedPost.id);
      if (feedIndex !== -1) {
        state.feedPosts[feedIndex] = updatedPost;
      }
      
      // Update in user posts
      Object.keys(state.userPosts).forEach(userId => {
        const userPostIndex = state.userPosts[Number(userId)].findIndex(p => p.id === updatedPost.id);
        if (userPostIndex !== -1) {
          state.userPosts[Number(userId)][userPostIndex] = updatedPost;
        }
      });
      
      // Update current post if it matches
      if (state.currentPost?.id === updatedPost.id) {
        state.currentPost = updatedPost;
      }
    },
    removePostFromState: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      
      // Remove from posts array
      state.posts = state.posts.filter(p => p.id !== postId);
      
      // Remove from feed posts
      state.feedPosts = state.feedPosts.filter(p => p.id !== postId);
      
      // Remove from user posts
      Object.keys(state.userPosts).forEach(userId => {
        state.userPosts[Number(userId)] = state.userPosts[Number(userId)].filter(p => p.id !== postId);
      });
      
      // Clear current post if it matches
      if (state.currentPost?.id === postId) {
        state.currentPost = null;
      }
    },
    resetFeed: (state) => {
      state.feedPosts = [];
      state.feedPage = 0;
      state.hasMoreFeed = true;
      state.lastFeedUpdate = null;
    },
    incrementFeedPage: (state) => {
      state.feedPage += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Feed
      .addCase(getFeedAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const { posts, hasNext, refresh } = action.payload;
        
        if (refresh) {
          state.feedPosts = posts;
          state.feedPage = 0;
        } else {
          state.feedPosts = [...state.feedPosts, ...posts];
        }
        
        state.hasMoreFeed = hasNext;
        state.lastFeedUpdate = new Date().toISOString();
      })
      .addCase(getFeedAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get User Posts
      .addCase(getUserPostsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserPostsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const { posts, userId } = action.payload;
        state.userPosts[userId] = posts;
      })
      .addCase(getUserPostsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get Post By ID
      .addCase(getPostByIdAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPostByIdAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(getPostByIdAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Post
      .addCase(createPostAsync.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.isCreating = false;
        const newPost = action.payload;
        state.feedPosts.unshift(newPost);
        state.posts.unshift(newPost);
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      
      // Update Post
      .addCase(updatePostAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updatePostAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        postSlice.caseReducers.updatePostInState(state, action);
      })
      .addCase(updatePostAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      
      // Delete Post
      .addCase(deletePostAsync.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.isDeleting = false;
        postSlice.caseReducers.removePostFromState(state, action);
      })
      .addCase(deletePostAsync.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })
      
      // Like Post
      .addCase(likePostAsync.fulfilled, (state, action) => {
        const { postId } = action.payload;
        
        const updateLike = (post: Post) => {
          if (post.id === postId) {
            post.isLiked = true;
            post.likesCount += 1;
          }
        };
        
        state.feedPosts.forEach(updateLike);
        state.posts.forEach(updateLike);
        Object.values(state.userPosts).flat().forEach(updateLike);
        if (state.currentPost?.id === postId && state.currentPost) {
          updateLike(state.currentPost);
        }
      })
      
      // Unlike Post
      .addCase(unlikePostAsync.fulfilled, (state, action) => {
        const { postId } = action.payload;
        
        const updateUnlike = (post: Post) => {
          if (post.id === postId) {
            post.isLiked = false;
            post.likesCount = Math.max(0, post.likesCount - 1);
          }
        };
        
        state.feedPosts.forEach(updateUnlike);
        state.posts.forEach(updateUnlike);
        Object.values(state.userPosts).flat().forEach(updateUnlike);
        if (state.currentPost?.id === postId && state.currentPost) {
          updateUnlike(state.currentPost);
        }
      })
      
      // Search Posts
      .addCase(searchPostsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPostsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
      })
      .addCase(searchPostsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearCurrentPost,
  updatePostInState,
  removePostFromState,
  resetFeed,
  incrementFeedPage,
} = postSlice.actions;

// Selectors
export const selectPosts = (state: any) => state.posts.posts;
export const selectFeedPosts = (state: any) => state.posts.feedPosts;
export const selectCurrentPost = (state: any) => state.posts.currentPost;
export const selectPostsLoading = (state: any) => state.posts.isLoading;
export const selectPostsCreating = (state: any) => state.posts.isCreating;
export const selectPostsError = (state: any) => state.posts.error;
export const selectHasMoreFeed = (state: any) => state.posts.hasMoreFeed;
export const selectFeedPage = (state: any) => state.posts.feedPage;
export const selectUserPosts = (userId: number) => (state: any) => 
  state.posts.userPosts[userId] || [];

export default postSlice.reducer; 