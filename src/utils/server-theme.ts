// lib/theme-server.ts
import { cookies } from 'next/headers';

export type Theme = 'light' | 'dark' | 'auto';
export type InferredTheme = 'light' | 'dark';

export interface ThemeInfo {
  theme: Theme;
  inferredTheme: InferredTheme | null;
  resolvedTheme: InferredTheme;
}

/**
 * Gets the current theme information from cookies
 * Useful for server-side rendering with the correct theme
 */
export async function getServerTheme(): Promise<ThemeInfo> {
  const cookieStore = await cookies();
  
  const theme = (cookieStore.get('theme')?.value as Theme) || 'auto';
  const inferredTheme = cookieStore.get('inferredTheme')?.value as InferredTheme | undefined;
  
  // Resolve the final theme to apply
  let resolvedTheme: InferredTheme = 'light'; // default fallback
  
  if (theme === 'auto') {
    // Use inferred theme if available, otherwise default to light
    resolvedTheme = inferredTheme || 'light';
  } else {
    // Use the explicitly set theme
    resolvedTheme = theme as InferredTheme;
  }
  
  return {
    theme,
    inferredTheme: inferredTheme || null,
    resolvedTheme
  };
}

/**
 * Helper function to get the resolved theme class for HTML attributes
 */
export async function getServerThemeClass(): Promise<string> {
  const { resolvedTheme } = await getServerTheme();
  return resolvedTheme;
}

/**
 * Helper function to get theme for data attributes
 */
export async function getServerThemeData(): Promise<{ 'data-theme': InferredTheme }> {
  const { resolvedTheme } = await getServerTheme();
  return { 'data-theme': resolvedTheme };
}