import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastMessage } from '@/shared/types';

interface AppState {
  isLoading: boolean;
  globalLoading: boolean;
  toasts: ToastMessage[];
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  currentPage: string;
  language: string;
  notifications: {
    permission: NotificationPermission;
    enabled: boolean;
  };
}

const initialState: AppState = {
  isLoading: false,
  globalLoading: false,
  toasts: [],
  sidebarOpen: true,
  mobileMenuOpen: false,
  currentPage: '',
  language: 'en',
  notifications: {
    permission: 'default',
    enabled: false,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    addToast: (state, action: PayloadAction<ToastMessage>) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setNotificationPermission: (state, action: PayloadAction<NotificationPermission>) => {
      state.notifications.permission = action.payload;
    },
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notifications.enabled = action.payload;
    },
  },
});

export const {
  setLoading,
  setGlobalLoading,
  addToast,
  removeToast,
  clearToasts,
  setSidebarOpen,
  toggleSidebar,
  setMobileMenuOpen,
  toggleMobileMenu,
  setCurrentPage,
  setLanguage,
  setNotificationPermission,
  setNotificationsEnabled,
} = appSlice.actions;

export const selectApp = (state: { app: AppState }) => state.app;
export const selectIsLoading = (state: { app: AppState }) => state.app.isLoading;
export const selectGlobalLoading = (state: { app: AppState }) => state.app.globalLoading;
export const selectToasts = (state: { app: AppState }) => state.app.toasts;
export const selectSidebarOpen = (state: { app: AppState }) => state.app.sidebarOpen;
export const selectMobileMenuOpen = (state: { app: AppState }) => state.app.mobileMenuOpen;
export const selectCurrentPage = (state: { app: AppState }) => state.app.currentPage;
export const selectLanguage = (state: { app: AppState }) => state.app.language;
export const selectNotifications = (state: { app: AppState }) => state.app.notifications; 