// IMPORTANT NOTE:
// THIS IS TO BE ADAPTED FOR USE WITH SERVER-SIDE-RENDERING. 
// IF YOU MAKE ANY FURTHER CHANGES PLEASE MAKE SURE THEY ARE SSR-COMPATIBLE.

'use client'

import React, { createContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'auto';
const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: 'light', setTheme: () => {} });

// Cookie utility functions
const setThemeCookies = (theme: Theme, inferredTheme?: 'light' | 'dark') => {
  document.cookie = `theme=${theme}; path=/; max-age=${365 * 24 * 60 * 60}`; // 1 year
  if (inferredTheme) {
    document.cookie = `inferredTheme=${inferredTheme}; path=/; max-age=${365 * 24 * 60 * 60}`;
  }
};

const getThemeCookie = (): Theme | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'theme' && (value === 'light' || value === 'dark' || value === 'auto')) {
      return value as Theme;
    }
  }
  return null;
};

const getInferredThemeCookie = (): 'light' | 'dark' | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'inferredTheme' && (value === 'light' || value === 'dark')) {
      return value as 'light' | 'dark';
    }
  }
  return null;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme after mount (SSR compatibility)
  useEffect(() => {
    const storedTheme = getThemeCookie();
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initial = storedTheme === 'auto' || !storedTheme
      ? (systemPrefersDark ? 'dark' : 'light')
      : storedTheme;

    setThemeState(storedTheme || 'auto');
    document.documentElement.classList.add(initial);
    
    // Set initial inferred theme cookie
    if (storedTheme === 'auto' || !storedTheme) {
      setThemeCookies(storedTheme || 'auto', systemPrefersDark ? 'dark' : 'light');
    }
    
    setIsMounted(true);
  }, []);

  // Apply theme changes and update cookies
  useEffect(() => {
    if (!isMounted) return;

    const apply = (t: Theme): 'light' | 'dark' => {
      const resolved = t === 'auto'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : t;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolved);
      return resolved;
    };

    const inferredTheme = apply(theme);
    setThemeCookies(theme, theme === 'auto' ? inferredTheme : undefined);

    if (theme === 'auto') {
      const listener = (e: MediaQueryListEvent) => {
        const newInferredTheme = apply('auto');
        setThemeCookies('auto', newInferredTheme);
      };
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme, isMounted]);

  // Prevent flash of unstyled content by not rendering until mounted
  if (!isMounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'light', setTheme: setThemeState }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;