export type Theme = 'light' | 'dark';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

export function getStoredTheme(): Theme | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem('theme');
  return isTheme(stored) ? stored : null;
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getResolvedTheme(storedTheme: Theme | null, systemTheme: Theme): Theme {
  return storedTheme ?? systemTheme;
}

export function getDocumentTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light';
  }

  const theme = document.documentElement.dataset.theme;
  return isTheme(theme) ? theme : 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}

export function toggleTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}

export function getToggleLabel(current: Theme): string {
  return current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}
