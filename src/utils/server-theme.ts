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
  
  let resolvedTheme: InferredTheme = 'light';
  
  if (theme === 'auto') {
    resolvedTheme = inferredTheme || 'light';
  } else {
    resolvedTheme = theme as InferredTheme;
  }
  
  return {
    theme,
    inferredTheme: inferredTheme || null,
    resolvedTheme
  };
}

export async function getServerThemeClass(): Promise<string> {
  const { resolvedTheme } = await getServerTheme();
  return resolvedTheme;
}

export async function getServerThemeData(): Promise<{ 'data-theme': InferredTheme }> {
  const { resolvedTheme } = await getServerTheme();
  return { 'data-theme': resolvedTheme };
}