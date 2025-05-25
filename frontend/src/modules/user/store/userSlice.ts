import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserState, User, UserProfile, UpdateUserData, UserSearch } from '../types/user.types';
import { userApi } from '../services/userApi';

const initialState: UserState = {
  currentUser: null,
  profiles: {},
  searchResults: {
    users: [],
    totalCount: 0,
    hasMore: false,
    isLoading: false,
    query: '',
  },
  isLoading: false,
  isUpdating: false,
  isUploading: false,
  error: null,
};

export const getCurrentUserAsync = createAsyncThunk(
  'user/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await userApi.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current user');
    }
  }
);

export const getUserProfileAsync = createAsyncThunk(
  'user/getUserProfile',
  async (userId: number, { rejectWithValue }) => {
    try {
      const profile = await userApi.getUserProfile(userId);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const updateUserProfileAsync = createAsyncThunk(
  'user/updateProfile',
  async (userData: UpdateUserData, { rejectWithValue }) => {
    try {
      const updatedUser = await userApi.updateProfile(userData);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadAvatarAsync = createAsyncThunk(
  'user/uploadAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await userApi.uploadAvatar(file);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
    }
  }
);

export const searchUsersAsync = createAsyncThunk(
  'user/searchUsers',
  async (searchParams: UserSearch, { rejectWithValue }) => {
    try {
      const results = await userApi.searchUsers(searchParams);
      return { ...results, searchParams };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search users');
    }
  }
);

export const followUserAsync = createAsyncThunk(
  'user/followUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await userApi.followUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
    }
  }
);

export const unfollowUserAsync = createAsyncThunk(
  'user/unfollowUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      await userApi.unfollowUser(userId);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
    }
  }
);

export const deleteUserAccountAsync = createAsyncThunk(
  'user/deleteAccount',
  async (password: string, { rejectWithValue }) => {
    try {
      await userApi.deleteAccount(password);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = {
        users: [],
        totalCount: 0,
        hasMore: false,
        isLoading: false,
        query: '',
      };
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<{ userId: number; updates: Partial<UserProfile> }>) => {
      const { userId, updates } = action.payload;
      if (state.profiles[userId]) {
        state.profiles[userId] = { ...state.profiles[userId], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(getCurrentUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profiles[action.payload.id] = action.payload;
      })
      .addCase(getUserProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfileAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentUser = action.payload;
        if (state.profiles[action.payload.id]) {
          state.profiles[action.payload.id] = { ...state.profiles[action.payload.id], ...action.payload };
        }
      })
      .addCase(updateUserProfileAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      .addCase(uploadAvatarAsync.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadAvatarAsync.fulfilled, (state, action) => {
        state.isUploading = false;
        if (state.currentUser) {
          state.currentUser.profilePictureUrl = action.payload.profilePictureUrl;
        }
      })
      .addCase(uploadAvatarAsync.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload as string;
      })
      .addCase(searchUsersAsync.pending, (state) => {
        state.searchResults.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsersAsync.fulfilled, (state, action) => {
        const { users, totalCount, hasMore } = action.payload;
        const { searchParams } = action.payload;
        
        state.searchResults.isLoading = false;
        state.searchResults.query = searchParams.query;
        state.searchResults.totalCount = totalCount;
        state.searchResults.hasMore = hasMore;
        
        if (searchParams.page === 1) {
          state.searchResults.users = users;
        } else {
          state.searchResults.users = [...state.searchResults.users, ...users];
        }
        
        users.forEach(user => {
          state.profiles[user.id] = user;
        });
      })
      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.searchResults.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(followUserAsync.fulfilled, (state, action) => {
        const userId = action.payload;
        if (state.profiles[userId]) {
          state.profiles[userId].isFollowing = true;
          state.profiles[userId].followerCount += 1;
        }
        if (state.currentUser) {
          state.currentUser.followingCount += 1;
        }
      })
      .addCase(unfollowUserAsync.fulfilled, (state, action) => {
        const userId = action.payload;
        if (state.profiles[userId]) {
          state.profiles[userId].isFollowing = false;
          state.profiles[userId].followerCount -= 1;
        }
        if (state.currentUser) {
          state.currentUser.followingCount -= 1;
        }
      })
      .addCase(deleteUserAccountAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserAccountAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.currentUser = null;
        state.profiles = {};
      })
      .addCase(deleteUserAccountAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  clearSearchResults, 
  updateCurrentUser, 
  setCurrentUser, 
  updateUserProfile 
} = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user;
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectUserProfile = (userId: number) => (state: { user: UserState }) => state.user.profiles[userId];
export const selectUserSearchResults = (state: { user: UserState }) => state.user.searchResults;
export const selectUserLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectUserUpdating = (state: { user: UserState }) => state.user.isUpdating;
export const selectUserUploading = (state: { user: UserState }) => state.user.isUploading;
export const selectUserError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer; 