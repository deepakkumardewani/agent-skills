import type { JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Phase } from '../../data/skills-data';
import { useDrawerModal } from '../../lib/drawer-modal';
import {
  createSearchIndex,
  descriptionSnippetForQuery,
  type HighlightSegment,
  highlightMatch,
  type SearchResult,
} from '../../lib/search';
import { getPhaseMeta } from '../../lib/skills';

const SEARCH_TRIGGER_ID = 'site-search-trigger';

function SearchIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const LIVE_REGION_DEBOUNCE_MS = 200;

function HighlightedText({ segments }: { segments: HighlightSegment[] }) {
  let offset = 0;
  return (
    <>
      {segments.map((segment) => {
        const key = `${offset}-${segment.highlight ? 'm' : 'p'}`;
        offset += segment.text.length;
        return segment.highlight ? (
          <mark key={key} className="search-dialog__result-match">
            {segment.text}
          </mark>
        ) : (
          <span key={key}>{segment.text}</span>
        );
      })}
    </>
  );
}

function ResultDescription({
  description,
  query,
  showFull,
}: {
  description: string;
  query: string;
  showFull: boolean;
}) {
  if (showFull) {
    return <span className="search-dialog__result-description">{description}</span>;
  }

  const snippet = descriptionSnippetForQuery(description, query);
  return (
    <span className="search-dialog__result-description">
      {snippet.leadingEllipsis ? <span aria-hidden="true">…</span> : null}
      <HighlightedText segments={highlightMatch(snippet.text, query)} />
      {snippet.trailingEllipsis ? <span aria-hidden="true">…</span> : null}
    </span>
  );
}

function PhaseChip({ phase, label }: { phase: Phase; label: string }) {
  const meta = getPhaseMeta(phase);
  return (
    <span
      className="search-dialog__phase-chip"
      style={{
        color: `var(${meta.fgVar})`,
        background: `var(${meta.subtleVar})`,
      }}
    >
      {label}
    </span>
  );
}

interface SearchDialogProps {
  initialOpen?: boolean;
}

export default function SearchDialog({ initialOpen = false }: SearchDialogProps) {
  const searchIndex = useMemo(() => createSearchIndex(), []);
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [liveMessage, setLiveMessage] = useState('');
  const openListAnnouncedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const isQueryEmpty = trimmedQuery.length === 0;
  const displayResults = useMemo(
    () => (isQueryEmpty ? searchIndex.listAll() : searchIndex.search(query)),
    [isQueryEmpty, query, searchIndex],
  );
  const showNoResults = !isQueryEmpty && displayResults.length === 0;

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const {
    drawerRef: dialogRef,
    captureTriggerFocus,
    trapFocus,
  } = useDrawerModal({
    isOpen,
    onClose: close,
    focusOnOpen: inputRef,
    closeOnEscape: false,
  });

  const open = useCallback(() => {
    captureTriggerFocus();
    setIsOpen(true);
    setQuery('');
    setActiveIndex(0);
  }, [captureTriggerFocus]);

  useEffect(() => {
    if (initialOpen) {
      open();
    }
  }, [initialOpen, open]);

  useEffect(() => {
    function handleOpenRequest() {
      open();
    }

    window.addEventListener('site-search:open', handleOpenRequest);
    return () => window.removeEventListener('site-search:open', handleOpenRequest);
  }, [open]);

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      close();
      window.location.assign(`/docs/skills/${result.slug}`);
    },
    [close],
  );

  useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [close, isOpen, open]);

  useEffect(() => {
    const trigger = document.getElementById(SEARCH_TRIGGER_ID);
    if (!trigger) {
      return;
    }

    function handleTriggerClick() {
      open();
    }

    trigger.addEventListener('click', handleTriggerClick);
    return () => trigger.removeEventListener('click', handleTriggerClick);
  }, [open]);

  useEffect(() => {
    if (!isOpen || !listRef.current) {
      return;
    }

    const activeItem = listRef.current.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    activeItem?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      openListAnnouncedRef.current = false;
      setLiveMessage('');
      return;
    }

    if (isQueryEmpty && displayResults.length > 0) {
      if (!openListAnnouncedRef.current) {
        openListAnnouncedRef.current = true;
        setLiveMessage(
          `${searchIndex.skillCount} ${searchIndex.skillCount === 1 ? 'skill' : 'skills'}`,
        );
      }
      return;
    }

    const timer = window.setTimeout(() => {
      if (showNoResults) {
        setLiveMessage('No results');
        return;
      }
      const count = displayResults.length;
      if (count === 0) {
        setLiveMessage('');
        return;
      }
      setLiveMessage(`${count} ${count === 1 ? 'result' : 'results'}`);
    }, LIVE_REGION_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [displayResults.length, isOpen, isQueryEmpty, searchIndex.skillCount, showNoResults]);

  function handleDialogKeyDown(event: JSX.TargetedKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (displayResults.length === 0) {
      trapFocus(event);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % displayResults.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + displayResults.length) % displayResults.length);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const selected = displayResults[activeIndex];
      if (selected) {
        navigateToResult(selected);
      }
      return;
    }

    trapFocus(event);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="search-dialog-root">
      <button
        type="button"
        className="search-dialog__backdrop"
        aria-label="Close search"
        onClick={close}
      />
      <div
        ref={dialogRef}
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search skills"
        onKeyDown={handleDialogKeyDown}
      >
        <div className="search-dialog__input-wrap">
          <span className="search-dialog__input-icon" aria-hidden="true">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            id="site-search-input"
            type="search"
            className="search-dialog__input"
            aria-label={`Search within ${searchIndex.skillCount} ${searchIndex.skillCount === 1 ? 'skill' : 'skills'}`}
            placeholder={`Search within ${searchIndex.skillCount} ${searchIndex.skillCount === 1 ? 'skill' : 'skills'}`}
            value={query}
            onInput={(event) => {
              setQuery(event.currentTarget.value);
              setActiveIndex(0);
            }}
            autoComplete="off"
            autoCorrect="off"
            spellcheck={false}
            aria-controls="site-search-results"
            aria-activedescendant={
              displayResults.length > 0 ? `site-search-result-${activeIndex}` : undefined
            }
          />
          <span className="search-dialog__esc">Esc</span>
        </div>

        <p className="search-dialog__sr-only" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </p>

        <div className="search-dialog__body">
          {showNoResults ? (
            <p className="search-dialog__status" role="status">
              Nothing matches &ldquo;{trimmedQuery}&rdquo;
            </p>
          ) : null}

          {displayResults.length > 0 ? (
            <div
              ref={listRef}
              id="site-search-results"
              className="search-dialog__results"
              role="listbox"
              aria-label={isQueryEmpty ? 'All skills' : 'Search results'}
            >
              {displayResults.map((result, index) => (
                <button
                  key={result.slug}
                  type="button"
                  id={`site-search-result-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  data-index={index}
                  className={`search-dialog__result${
                    index === activeIndex ? ' search-dialog__result--active' : ''
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => navigateToResult(result)}
                >
                  <span className="search-dialog__result-main">
                    <span className="search-dialog__result-name">
                      {isQueryEmpty ? (
                        result.displayName
                      ) : (
                        <HighlightedText
                          segments={highlightMatch(result.displayName, trimmedQuery)}
                        />
                      )}
                    </span>
                    {result.primaryTrigger ? (
                      <code className="search-dialog__trigger">{result.primaryTrigger}</code>
                    ) : null}
                    <PhaseChip phase={result.phase} label={result.phaseLabel} />
                  </span>
                  <ResultDescription
                    description={result.description}
                    query={trimmedQuery}
                    showFull={isQueryEmpty}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <footer className="search-dialog__footer" aria-hidden="true">
          <span>↑↓ navigate</span>
          <span className="search-dialog__footer-sep">·</span>
          <span>↵ open</span>
          <span className="search-dialog__footer-sep">·</span>
          <span>esc close</span>
        </footer>
      </div>

      <style>{`
        .search-dialog-root {
          position: fixed;
          inset: 0;
          z-index: 100;
        }

        .search-dialog__backdrop {
          position: absolute;
          inset: 0;
          border: 0;
          padding: 0;
          background: color-mix(in srgb, var(--color-fg-default) 8%, transparent);
          cursor: default;
        }

        .search-dialog {
          position: relative;
          margin-left: auto;
          margin-right: auto;
          border: 1px solid var(--color-outline);
          border-radius: var(--radius-xl);
          background: var(--color-surface);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          animation: search-dialog-in var(--duration-fast) var(--ease-out);
        }

        .search-dialog__input-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-4);
          border-bottom: 1px solid var(--color-outline);
        }

        .search-dialog__input-icon {
          display: inline-flex;
          flex-shrink: 0;
          color: var(--color-fg-subtle);
        }

        .search-dialog__sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .search-dialog__input {
          flex: 1;
          min-width: 0;
          height: 40px;
          border: 0;
          border-radius: 0;
          padding: 0 var(--space-2);
          background: transparent;
          color: var(--color-fg-default);
          font-family: inherit;
          font-size: var(--text-body-sm-size);
          line-height: var(--text-body-sm-line-height);
        }

        .search-dialog__input:focus,
        .search-dialog__input:focus-visible {
          outline: none;
          box-shadow: var(--shadow-focus);
        }

        .search-dialog__esc {
          flex-shrink: 0;
          padding: 0 var(--space-1);
          border: 1px solid var(--color-outline);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: var(--text-code-sm-size);
          line-height: 1.4;
          color: var(--color-fg-subtle);
          background: var(--color-code-bg);
        }

        .search-dialog__body {
          max-height: min(50vh, 420px);
          overflow: auto;
          padding: var(--space-2);
        }

        .search-dialog__status {
          margin: 0;
          padding: var(--space-6) var(--space-4);
          text-align: center;
          color: var(--color-fg-muted);
          font-size: var(--text-body-sm-size);
          line-height: var(--text-body-sm-line-height);
        }

        .search-dialog__results {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .search-dialog__result {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          width: 100%;
          min-height: 44px;
          padding: 10px 12px;
          border: 0;
          border-radius: var(--radius-default);
          background: transparent;
          color: var(--color-fg-default);
          text-align: left;
          cursor: pointer;
          font: inherit;
        }

        .search-dialog__result:hover,
        .search-dialog__result--active {
          background: var(--color-primary-subtle);
          color: var(--color-on-primary-subtle);
        }

        .search-dialog__result:focus-visible {
          outline: none;
          box-shadow: var(--shadow-focus);
        }

        .search-dialog__result-main {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          min-width: 0;
        }

        .search-dialog__result-name {
          font-size: var(--text-body-sm-size);
          font-weight: var(--text-label-md-weight);
          line-height: var(--text-body-sm-line-height);
        }

        .search-dialog__result-match {
          font-weight: 600;
          padding: 0 0.12em;
          margin: 0 -0.06em;
          border-radius: var(--radius-sm);
          background: var(--color-search-match-bg);
          color: inherit;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
        }

        .search-dialog__result:hover .search-dialog__result-match,
        .search-dialog__result--active .search-dialog__result-match {
          background: var(--color-search-match-bg-active);
        }

        .search-dialog__phase-chip {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          height: 20px;
          padding: 0 8px;
          border-radius: var(--radius-full);
          font-size: 10px;
          font-weight: var(--text-caps-xs-weight);
          line-height: 12px;
          letter-spacing: var(--text-caps-xs-letter-spacing);
          text-transform: uppercase;
        }

        .search-dialog__result-description {
          display: -webkit-box;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          color: var(--color-fg-muted);
          font-size: var(--text-body-sm-size);
          line-height: var(--text-body-sm-line-height);
        }

        .search-dialog__result--active .search-dialog__result-description,
        .search-dialog__result:hover .search-dialog__result-description {
          color: var(--color-on-primary-subtle);
        }

        .search-dialog__trigger {
          flex-shrink: 0;
          padding: 0 var(--space-1);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: var(--text-code-sm-size);
          line-height: var(--text-code-sm-line-height);
          color: var(--color-fg-subtle);
          background: var(--color-code-bg);
        }

        .search-dialog__result--active .search-dialog__trigger,
        .search-dialog__result:hover .search-dialog__trigger {
          color: var(--color-on-primary-subtle);
          background: color-mix(in srgb, var(--color-on-primary-subtle) 12%, transparent);
        }

        .search-dialog__footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          border-top: 1px solid var(--color-outline);
          color: var(--color-fg-subtle);
          font-size: var(--text-body-sm-size);
          line-height: var(--text-body-sm-line-height);
        }

        .search-dialog__footer-sep {
          color: var(--color-fg-subtle);
          opacity: 0.6;
        }

        @keyframes search-dialog-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 639px) {
          .search-dialog {
            width: calc(100vw - var(--space-4));
            margin-top: 8vh;
          }
        }

        @media (min-width: 640px) {
          .search-dialog {
            width: min(560px, calc(100vw - var(--space-8)));
            margin-top: min(20vh, 120px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .search-dialog {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
