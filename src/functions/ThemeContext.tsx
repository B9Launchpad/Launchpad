// IMPORTANT NOTE:
// THIS IS TO BE ADAPTED FOR USE WITH SERVER-SIDE-RENDERING. 
// IF YOU MAKE ANY FURTHER CHANGES PLEASE MAKE SURE THEY ARE SSR-COMPATIBLE.

import React, { createContext, useEffect, useState, ReactNode } from 'react';
const storedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme === 'auto' || !storedTheme
  ? (systemPrefersDark ? 'dark' : 'light')
  : storedTheme;
  document.documentElement.classList.add(initialTheme);

export type Theme = 'light' | 'dark' | 'auto';
const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: 'light', setTheme: () => {} });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'auto';
  });

  useEffect(() => {
    const apply = (t: Theme) => {
      const resolved = t === 'auto' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') 
        : t;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(`${resolved}`);
    };

    apply(theme);
    localStorage.setItem('theme', theme);

    if (theme === 'auto') {
      const listener = (e: MediaQueryListEvent) => {
        apply('auto');
      };
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
      return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;