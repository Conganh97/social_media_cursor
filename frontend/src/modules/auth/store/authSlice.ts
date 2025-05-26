import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, RegisterData, User } from '../types/auth.types';
import { authApi } from '../services/authApi';
import { LOCAL_STORAGE_KEYS } from '@/shared/utils/constants';

const getInitialAuthState = (): AuthState => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  
  return {
    user: null,
    token,
    refreshToken,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialAuthState();

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, response.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, response.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refreshToken = state.auth.refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await authApi.refreshToken(refreshToken);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, response.token);
      return response;
    } catch (error: any) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    if (state.auth.token) {
      try {
        await authApi.logout();
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  }
);

export const verifyEmailAsync = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyEmail(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Email verification failed');
    }
  }
);

export const requestPasswordResetAsync = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      await authApi.requestPasswordReset(email);
      return email;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset request failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          id: action.payload.userId,
          username: action.payload.username,
          email: action.payload.email,
          firstName: '',
          lastName: '',
          profilePictureUrl: undefined,
          bio: undefined,
          location: undefined,
          website: undefined,
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          isActive: true,
        };
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          id: action.payload.userId,
          username: action.payload.username,
          email: action.payload.email,
          firstName: '',
          lastName: '',
          profilePictureUrl: undefined,
          bio: undefined,
          location: undefined,
          website: undefined,
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          isActive: true,
        };
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(verifyEmailAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyEmailAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(requestPasswordResetAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordResetAsync.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(requestPasswordResetAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser, clearAuth } = authSlice.actions;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer; 