import { h, render } from 'preact';

const SEARCH_ROOT_ID = 'search-dialog-root';
const SEARCH_TRIGGER_ID = 'site-search-trigger';

function isDocsRoute(pathname: string): boolean {
  return pathname === '/docs' || pathname.startsWith('/docs/');
}

let mountPromise: Promise<void> | null = null;
let bootListenersAttached = false;

function removeBootListeners(): void {
  document.removeEventListener('keydown', handleBootKeyDown);
  document.removeEventListener('click', handleBootTriggerClick);
  bootListenersAttached = false;
}

async function mountSearchDialog(initialOpen: boolean): Promise<void> {
  const root = document.getElementById(SEARCH_ROOT_ID);
  if (!root) {
    return;
  }

  if (root.dataset.mounted === 'true') {
    if (initialOpen) {
      window.dispatchEvent(new CustomEvent('site-search:open'));
    }
    return;
  }

  const { default: SearchDialog } = await import('../components/search/SearchDialog');
  render(h(SearchDialog, { initialOpen }), root);
  root.dataset.mounted = 'true';
  removeBootListeners();
}

function ensureMounted(initialOpen: boolean): Promise<void> {
  mountPromise ??= mountSearchDialog(initialOpen).finally(() => {
    mountPromise = null;
  });
  return mountPromise;
}

function handleBootKeyDown(event: KeyboardEvent): void {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    void ensureMounted(true);
  }
}

function handleBootTriggerClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (!target.closest(`#${SEARCH_TRIGGER_ID}`)) {
    return;
  }

  void ensureMounted(true);
}

function attachBootListeners(): void {
  if (bootListenersAttached) {
    return;
  }

  document.addEventListener('keydown', handleBootKeyDown);
  document.addEventListener('click', handleBootTriggerClick);
  bootListenersAttached = true;
}

function scheduleIdleMount(): void {
  const run = () => {
    void ensureMounted(false);
  };

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: 2000 });
    return;
  }

  window.setTimeout(run, 1);
}

export function setupSearchLauncher(): void {
  attachBootListeners();

  if (isDocsRoute(window.location.pathname)) {
    scheduleIdleMount();
  }
}
