import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConnectivityState {
  isOnline: boolean;
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  retryCount: number;
  lastSyncTime: number;
  pendingRequests: string[];
  networkSpeed: 'slow' | 'medium' | 'fast';
  syncInProgress: boolean;
}

const initialState: ConnectivityState = {
  isOnline: navigator.onLine,
  connectionType: 'unknown',
  retryCount: 0,
  lastSyncTime: Date.now(),
  pendingRequests: [],
  networkSpeed: 'medium',
  syncInProgress: false,
};

export const connectivitySlice = createSlice({
  name: 'connectivity',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
      if (action.payload) {
        state.retryCount = 0;
      }
    },
    setConnectionType: (state, action: PayloadAction<'wifi' | 'cellular' | 'ethernet' | 'unknown'>) => {
      state.connectionType = action.payload;
    },
    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },
    resetRetryCount: (state) => {
      state.retryCount = 0;
    },
    updateLastSyncTime: (state) => {
      state.lastSyncTime = Date.now();
    },
    addPendingRequest: (state, action: PayloadAction<string>) => {
      if (!state.pendingRequests.includes(action.payload)) {
        state.pendingRequests.push(action.payload);
      }
    },
    removePendingRequest: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter(id => id !== action.payload);
    },
    clearPendingRequests: (state) => {
      state.pendingRequests = [];
    },
    setNetworkSpeed: (state, action: PayloadAction<'slow' | 'medium' | 'fast'>) => {
      state.networkSpeed = action.payload;
    },
    setSyncInProgress: (state, action: PayloadAction<boolean>) => {
      state.syncInProgress = action.payload;
    },
  },
});

export const {
  setOnlineStatus,
  setConnectionType,
  incrementRetryCount,
  resetRetryCount,
  updateLastSyncTime,
  addPendingRequest,
  removePendingRequest,
  clearPendingRequests,
  setNetworkSpeed,
  setSyncInProgress,
} = connectivitySlice.actions;

export const selectConnectivity = (state: { connectivity: ConnectivityState }) => state.connectivity;
export const selectIsOnline = (state: { connectivity: ConnectivityState }) => state.connectivity.isOnline;
export const selectConnectionType = (state: { connectivity: ConnectivityState }) => state.connectivity.connectionType;
export const selectRetryCount = (state: { connectivity: ConnectivityState }) => state.connectivity.retryCount;
export const selectLastSyncTime = (state: { connectivity: ConnectivityState }) => state.connectivity.lastSyncTime;
export const selectPendingRequests = (state: { connectivity: ConnectivityState }) => state.connectivity.pendingRequests;
export const selectNetworkSpeed = (state: { connectivity: ConnectivityState }) => state.connectivity.networkSpeed;
export const selectSyncInProgress = (state: { connectivity: ConnectivityState }) => state.connectivity.syncInProgress; 