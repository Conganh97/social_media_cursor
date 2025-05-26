import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

import { appSlice } from './slices/appSlice';
import { themeSlice } from './slices/themeSlice';
import { connectivitySlice } from './slices/connectivitySlice';
import authReducer from '@/modules/auth/store/authSlice';
import userReducer from '@/modules/user/store/userSlice';
import postReducer from '@/modules/post/store/postSlice';
import socialReducer from '@/modules/social/store/socialSlice';
import messageReducer from '@/modules/messaging/store/messageSlice';
import notificationReducer from '@/modules/notification/store/notificationSlice';

const rootReducer = combineReducers({
  app: appSlice.reducer,
  theme: themeSlice.reducer,
  connectivity: connectivitySlice.reducer,
  auth: authReducer,
  user: userReducer,
  posts: postReducer,
  social: socialReducer,
  messages: messageReducer,
  notification: notificationReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export * from './slices/appSlice';
export * from './slices/themeSlice';
export * from './slices/connectivitySlice'; 