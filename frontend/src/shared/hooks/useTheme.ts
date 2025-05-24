import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
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
  selectTheme,
  selectThemeMode,
} from '@/store';
import { Theme } from '@/shared/types';

export interface UseThemeReturn {
  theme: ReturnType<typeof selectTheme>;
  mode: Theme;
  setMode: (mode: Theme) => void;
  setPrimary: (color: string) => void;
  setSecondary: (color: string) => void;
  setFont: (family: string) => void;
  setSize: (size: 'small' | 'medium' | 'large') => void;
  setRadius: (radius: number) => void;
  setAnimations: (enabled: boolean) => void;
  setMotion: (reduced: boolean) => void;
  toggle: () => void;
  reset: () => void;
  isDarkMode: boolean;
  isLightMode: boolean;
  isSystemMode: boolean;
}

export function useTheme(): UseThemeReturn {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const mode = useAppSelector(selectThemeMode);

  const setMode = useCallback((newMode: Theme) => {
    dispatch(setThemeMode(newMode));
  }, [dispatch]);

  const setPrimary = useCallback((color: string) => {
    dispatch(setPrimaryColor(color));
  }, [dispatch]);

  const setSecondary = useCallback((color: string) => {
    dispatch(setSecondaryColor(color));
  }, [dispatch]);

  const setFont = useCallback((family: string) => {
    dispatch(setFontFamily(family));
  }, [dispatch]);

  const setSize = useCallback((size: 'small' | 'medium' | 'large') => {
    dispatch(setFontSize(size));
  }, [dispatch]);

  const setRadius = useCallback((radius: number) => {
    dispatch(setBorderRadius(radius));
  }, [dispatch]);

  const setAnimations = useCallback((enabled: boolean) => {
    dispatch(setAnimation(enabled));
  }, [dispatch]);

  const setMotion = useCallback((reduced: boolean) => {
    dispatch(setReducedMotion(reduced));
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(resetTheme());
  }, [dispatch]);

  const isDarkMode = mode === 'dark';
  const isLightMode = mode === 'light';
  const isSystemMode = mode === 'system';

  return {
    theme,
    mode,
    setMode,
    setPrimary,
    setSecondary,
    setFont,
    setSize,
    setRadius,
    setAnimations,
    setMotion,
    toggle,
    reset,
    isDarkMode,
    isLightMode,
    isSystemMode,
  };
} 