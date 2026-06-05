import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyTheme,
  getDocumentTheme,
  getResolvedTheme,
  getStoredTheme,
  getSystemTheme,
  getToggleLabel,
  isTheme,
  toggleTheme,
} from '../../src/lib/theme';

function createStorage() {
  const storage = new Map<string, string>();

  return {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
  };
}

describe('theme lib', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('validates theme values', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('system')).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it('resolves stored theme over system preference', () => {
    expect(getResolvedTheme('dark', 'light')).toBe('dark');
    expect(getResolvedTheme(null, 'light')).toBe('light');
  });

  it('toggles between light and dark', () => {
    expect(toggleTheme('light')).toBe('dark');
    expect(toggleTheme('dark')).toBe('light');
  });

  it('returns accessible toggle labels', () => {
    expect(getToggleLabel('light')).toBe('Switch to dark mode');
    expect(getToggleLabel('dark')).toBe('Switch to light mode');
  });

  it('falls back safely when browser globals are unavailable', () => {
    vi.stubGlobal('localStorage', undefined);
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);

    expect(getStoredTheme()).toBeNull();
    expect(getSystemTheme()).toBe('light');
    expect(getDocumentTheme()).toBe('light');
  });

  describe('browser APIs', () => {
    const documentElement = { dataset: { theme: 'light' } };

    beforeEach(() => {
      vi.stubGlobal('localStorage', createStorage());
      vi.stubGlobal('document', { documentElement });
      documentElement.dataset.theme = 'light';
    });

    it('reads and writes stored theme preference', () => {
      expect(getStoredTheme()).toBeNull();

      localStorage.setItem('theme', 'dark');
      expect(getStoredTheme()).toBe('dark');
    });

    it('detects system theme from matchMedia', () => {
      vi.stubGlobal('window', {
        matchMedia: vi.fn().mockReturnValue({
          matches: true,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
      });

      expect(getSystemTheme()).toBe('dark');
    });

    it('falls back to light when the system prefers light mode', () => {
      vi.stubGlobal('window', {
        matchMedia: vi.fn().mockReturnValue({
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }),
      });

      expect(getSystemTheme()).toBe('light');
    });

    it('reads theme from the document root', () => {
      documentElement.dataset.theme = 'dark';
      expect(getDocumentTheme()).toBe('dark');
    });

    it('defaults to light when the document root has an invalid theme', () => {
      documentElement.dataset.theme = 'system';
      expect(getDocumentTheme()).toBe('light');
    });

    it('applies theme to document and localStorage', () => {
      applyTheme('dark');

      expect(documentElement.dataset.theme).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });
});
