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

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('auto');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initial = storedTheme === 'auto' || !storedTheme
      ? (systemPrefersDark ? 'dark' : 'light')
      : storedTheme;

    setThemeState(initial);
    document.documentElement.classList.add(initial);
  }, []);

  useEffect(() => {
    const apply = (t: Theme) => {
      const resolved = t === 'auto'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : t;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(resolved);
    };

    apply(theme);
    localStorage.setItem('theme', theme);

    if (theme === 'auto') {
      const listener = (e: MediaQueryListEvent) => apply('auto');
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
