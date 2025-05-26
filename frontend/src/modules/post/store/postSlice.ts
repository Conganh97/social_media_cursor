import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, PostsState, CreatePostData, UpdatePostData, PostFilters } from '../types/post.types';
import { postApi } from '../services/postApi';
import { likeApi } from '@/modules/social/services';

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
      console.log('🔍 Feed Response Debug:', {
        responseStructure: response,
        hasContent: !!response.content,
        contentLength: response.content?.length || 0,
        firstPost: response.content?.[0],
        firstPostHasUser: !!response.content?.[0]?.user,
        firstPostUser: response.content?.[0]?.user
      });
      return { ...response, refresh: params.refresh || false };
    } catch (error: any) {
      console.error('❌ Failed to load feed:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to load feed');
    }
  }
);

export const getUserPostsAsync = createAsyncThunk(
  'posts/getUserPosts',
  async (params: { userId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await postApi.getUserPosts(params.userId, params.page || 0, params.size || 10);
      console.log('🔍 User Posts Response Debug:', {
        userId: params.userId,
        responseStructure: response,
        hasContent: !!response.content,
        contentLength: response.content?.length || 0,
        firstPost: response.content?.[0],
        firstPostHasUser: !!response.content?.[0]?.user,
        firstPostUser: response.content?.[0]?.user
      });
      return { ...response, userId: params.userId };
    } catch (error: any) {
      console.error('❌ Failed to load user posts:', error);
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
      console.log('Creating post with data:', postData);
      const response = await postApi.createPost(postData);
      console.log('Post created successfully:', response);
      return response;
    } catch (error: any) {
      console.error('Failed to create post:', error);
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
      const response = await likeApi.likePost(postId);
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
      const response = await likeApi.unlikePost(postId);
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
      
      // Ensure arrays exist before updating
      if (!state.posts) state.posts = [];
      if (!state.feedPosts) state.feedPosts = [];
      if (!state.userPosts) state.userPosts = {};
      
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
        if (state.userPosts[Number(userId)]) {
          const userPostIndex = state.userPosts[Number(userId)].findIndex(p => p.id === updatedPost.id);
          if (userPostIndex !== -1) {
            state.userPosts[Number(userId)][userPostIndex] = updatedPost;
          }
        }
      });
      
      // Update current post if it matches
      if (state.currentPost?.id === updatedPost.id) {
        state.currentPost = updatedPost;
      }
    },
    removePostFromState: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      
      // Ensure arrays exist before removing
      if (!state.posts) state.posts = [];
      if (!state.feedPosts) state.feedPosts = [];
      if (!state.userPosts) state.userPosts = {};
      
      // Remove from posts array
      state.posts = state.posts.filter(p => p.id !== postId);
      
      // Remove from feed posts
      state.feedPosts = state.feedPosts.filter(p => p.id !== postId);
      
      // Remove from user posts
      Object.keys(state.userPosts).forEach(userId => {
        if (state.userPosts[Number(userId)]) {
          state.userPosts[Number(userId)] = state.userPosts[Number(userId)].filter(p => p.id !== postId);
        }
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
        const { content, last, refresh } = action.payload;
        
        // Ensure feedPosts array exists
        if (!state.feedPosts) state.feedPosts = [];
        
        if (refresh) {
          state.feedPosts = content || [];
          state.feedPage = 0;
        } else {
          state.feedPosts = [...state.feedPosts, ...(content || [])];
        }
        
        state.hasMoreFeed = !last;
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
        const { content, userId } = action.payload;
        
        // Ensure userPosts object exists
        if (!state.userPosts) state.userPosts = {};
        state.userPosts[userId] = content || [];
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
        
        // Validate that the post has required fields
        if (!newPost || !newPost.id || !newPost.user) {
          console.error('Invalid post data received:', newPost);
          state.error = 'Invalid post data received from server';
          return;
        }
        
        // Ensure arrays exist before adding new post
        if (!state.feedPosts) state.feedPosts = [];
        if (!state.posts) state.posts = [];
        
        // Add default values for missing properties using correct field names
        const completePost = {
          ...newPost,
          tags: newPost.tags || [],
          mentions: newPost.mentions || [],
          likeCount: newPost.likeCount || 0,
          commentCount: newPost.commentCount || 0,
          isLikedByCurrentUser: newPost.isLikedByCurrentUser || false,
        };
        
        state.feedPosts.unshift(completePost);
        state.posts.unshift(completePost);
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
        const { postId, liked, likeCount } = action.payload;
        
        const updateLike = (post: Post) => {
          if (post.id === postId) {
            post.isLikedByCurrentUser = liked;
            post.likeCount = likeCount;
          }
        };
        
        // Ensure arrays exist before updating
        if (!state.feedPosts) state.feedPosts = [];
        if (!state.posts) state.posts = [];
        if (!state.userPosts) state.userPosts = {};
        
        state.feedPosts.forEach(updateLike);
        state.posts.forEach(updateLike);
        Object.values(state.userPosts).flat().forEach(updateLike);
        if (state.currentPost?.id === postId && state.currentPost) {
          updateLike(state.currentPost);
        }
      })
      
      // Unlike Post
      .addCase(unlikePostAsync.fulfilled, (state, action) => {
        const { postId, unliked, likeCount } = action.payload;
        
        const updateUnlike = (post: Post) => {
          if (post.id === postId) {
            post.isLikedByCurrentUser = !unliked;
            post.likeCount = likeCount;
          }
        };
        
        // Ensure arrays exist before updating
        if (!state.feedPosts) state.feedPosts = [];
        if (!state.posts) state.posts = [];
        if (!state.userPosts) state.userPosts = {};
        
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
        state.posts = action.payload.content || [];
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
export const selectPosts = (state: any) => state.posts?.posts || [];
export const selectFeedPosts = (state: any) => state.posts?.feedPosts || [];
export const selectCurrentPost = (state: any) => state.posts?.currentPost || null;
export const selectPostsLoading = (state: any) => state.posts?.isLoading || false;
export const selectPostsCreating = (state: any) => state.posts?.isCreating || false;
export const selectPostsError = (state: any) => state.posts?.error || null;
export const selectHasMoreFeed = (state: any) => state.posts?.hasMoreFeed || false;
export const selectFeedPage = (state: any) => state.posts?.feedPage || 0;
export const selectUserPosts = (userId: number) => (state: any) => 
  state.posts?.userPosts?.[userId] || [];

export default postSlice.reducer; 