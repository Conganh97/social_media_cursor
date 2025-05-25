import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '@/shared/types';

interface ThemeState {
  mode: Theme;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: number;
  animation: boolean;
  reducedMotion: boolean;
}

const initialState: ThemeState = {
  mode: 'system',
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
  fontFamily: 'Roboto',
  fontSize: 'medium',
  borderRadius: 8,
  animation: true,
  reducedMotion: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<Theme>) => {
      state.mode = action.payload;
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
    },
    setSecondaryColor: (state, action: PayloadAction<string>) => {
      state.secondaryColor = action.payload;
    },
    setFontFamily: (state, action: PayloadAction<string>) => {
      state.fontFamily = action.payload;
    },
    setFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.fontSize = action.payload;
    },
    setBorderRadius: (state, action: PayloadAction<number>) => {
      state.borderRadius = action.payload;
    },
    setAnimation: (state, action: PayloadAction<boolean>) => {
      state.animation = action.payload;
    },
    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.reducedMotion = action.payload;
    },
    toggleTheme: (state) => {
      if (state.mode === 'light') {
        state.mode = 'dark';
      } else if (state.mode === 'dark') {
        state.mode = 'light';
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        state.mode = prefersDark ? 'light' : 'dark';
      }
    },
    resetTheme: (_state) => {
      return initialState;
    },
  },
});

export const {
  setThemeMode,
  setPrimaryColor,
  setSecondaryColor,
  setFontFamily,
  setFontSize,
  setBorderRadius,
  setAnimation,
  setReducedMotion,
  toggleTheme,
  resetTheme,
} = themeSlice.actions;

export const selectTheme = (state: { theme: ThemeState }) => state.theme;
export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode;
export const selectPrimaryColor = (state: { theme: ThemeState }) => state.theme.primaryColor;
export const selectSecondaryColor = (state: { theme: ThemeState }) => state.theme.secondaryColor;
export const selectFontFamily = (state: { theme: ThemeState }) => state.theme.fontFamily;
export const selectFontSize = (state: { theme: ThemeState }) => state.theme.fontSize;
export const selectBorderRadius = (state: { theme: ThemeState }) => state.theme.borderRadius;
export const selectAnimation = (state: { theme: ThemeState }) => state.theme.animation;
export const selectReducedMotion = (state: { theme: ThemeState }) => state.theme.reducedMotion; 