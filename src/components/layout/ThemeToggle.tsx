import { useEffect, useState } from 'react';
import {
  applyTheme,
  getDocumentTheme,
  getToggleLabel,
  type Theme,
  toggleTheme,
} from '../../lib/theme';

function SunIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <title>Sun</title>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <title>Moon</title>
      <path
        d="M21 14.5A8.5 8.5 0 1 1 9.5 3 6.5 6.5 0 0 0 21 14.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(getDocumentTheme());
  }, []);

  function handleToggle() {
    const nextTheme = toggleTheme(theme);
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  const label = getToggleLabel(theme);

  return (
    <button type="button" className="theme-toggle" onClick={handleToggle} aria-label={label}>
      <span className="theme-toggle__icon" aria-hidden="true">
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </span>
      <span className="sr-only">{label}</span>
      <style>{`
        .theme-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          min-height: 40px;
          padding: 0 var(--space-2);
          border: 1px solid var(--color-outline);
          border-radius: var(--radius-default);
          background: var(--color-surface);
          color: var(--color-fg-muted);
          cursor: pointer;
          transition:
            background var(--duration-fast) var(--ease-out),
            border-color var(--duration-fast) var(--ease-out),
            color var(--duration-fast) var(--ease-out);
        }

        .theme-toggle:hover {
          border-color: var(--color-outline-strong);
          background: var(--color-surface-elevated);
          color: var(--color-fg-default);
        }

        .theme-toggle:focus-visible {
          outline: none;
          box-shadow: var(--shadow-focus);
        }

        .theme-toggle__icon {
          display: inline-flex;
        }

        .sr-only {
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

        @media (prefers-reduced-motion: reduce) {
          .theme-toggle {
            transition: none;
          }
        }
      `}</style>
    </button>
  );
}
