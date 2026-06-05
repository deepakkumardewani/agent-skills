/// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/components/search/SearchDialog', () => ({
  default: function MockSearchDialog() {
    return null;
  },
}));

import { setupSearchLauncher } from '../../src/lib/search-boot';

describe('setupSearchLauncher', () => {
  let root: HTMLDivElement;
  let trigger: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="site-search-trigger" type="button">Search</button>
      <div id="search-dialog-root"></div>
    `;
    root = document.getElementById('search-dialog-root') as HTMLDivElement;
    trigger = document.getElementById('site-search-trigger') as HTMLButtonElement;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('mounts the dialog when Cmd+K is pressed', async () => {
    setupSearchLauncher();

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }),
    );

    await vi.waitFor(() => {
      expect(root.dataset.mounted).toBe('true');
    });
  });

  it('mounts the dialog when the search trigger is clicked', async () => {
    setupSearchLauncher();

    trigger.click();

    await vi.waitFor(() => {
      expect(root.dataset.mounted).toBe('true');
    });
  });

  it('dispatches open when already mounted and the launcher runs again', async () => {
    setupSearchLauncher();
    root.dataset.mounted = 'true';

    const openSpy = vi.fn();
    window.addEventListener('site-search:open', openSpy);

    trigger.click();

    await vi.waitFor(() => {
      expect(openSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('ignores clicks outside the search trigger', async () => {
    setupSearchLauncher();

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(root.dataset.mounted).toBeUndefined();
  });

  it('ignores click events whose target is not an element', async () => {
    setupSearchLauncher();

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(root.dataset.mounted).toBeUndefined();
  });

  it('preloads on docs routes during idle time', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('location', { ...window.location, pathname: '/docs/skills/build' });

    const idleCallback = vi.fn((callback: IdleRequestCallback) => {
      callback({ didTimeout: false, timeRemaining: () => 50 });
      return 1;
    });
    vi.stubGlobal('requestIdleCallback', idleCallback);

    setupSearchLauncher();

    expect(idleCallback).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(root.dataset.mounted).toBe('true'));
  });

  it('falls back to setTimeout when requestIdleCallback is unavailable', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('location', { ...window.location, pathname: '/docs' });
    vi.stubGlobal('requestIdleCallback', undefined);

    setupSearchLauncher();
    await vi.advanceTimersByTimeAsync(2);

    expect(root.dataset.mounted).toBe('true');
  });

  it('does not idle-preload on marketing routes', () => {
    vi.stubGlobal('location', { ...window.location, pathname: '/about' });
    const idleCallback = vi.fn();
    vi.stubGlobal('requestIdleCallback', idleCallback);

    setupSearchLauncher();

    expect(idleCallback).not.toHaveBeenCalled();
  });

  it('returns early when the mount root is missing', async () => {
    root.remove();
    setupSearchLauncher();

    trigger.click();

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(document.getElementById('search-dialog-root')).toBeNull();
  });
});
