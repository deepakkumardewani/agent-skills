import { useEffect, useRef, useState } from 'react';

interface CopyableCommandProps {
  command: string;
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <title>Copy</title>
      <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 11H3.5C2.67 11 2 10.33 2 9.5V3.5C2 2.67 2.67 2 3.5 2H9.5C10.33 2 11 2.67 11 3.5V4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <title>Copied</title>
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CopyableCommand({ command }: CopyableCommandProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      className="copyable-command"
      onClick={handleCopy}
      aria-label={`Copy command ${command}`}
    >
      <code className="copyable-command__text">{command}</code>
      <span
        className={`copyable-command__icon${copied ? ' copyable-command__icon--copied' : ''}`}
        style={{ transition: prefersReducedMotion ? 'none' : undefined }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
      <style>{`
        .copyable-command {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--color-outline);
          border-radius: var(--radius-default);
          background: var(--color-code-bg);
          color: var(--color-code-fg);
          font-family: var(--font-mono);
          font-size: var(--text-code-md-size);
          line-height: var(--text-code-md-line-height);
          cursor: pointer;
          transition:
            background var(--duration-fast) var(--ease-out),
            border-color var(--duration-fast) var(--ease-out);
        }

        .copyable-command:hover {
          border-color: var(--color-outline-strong);
          background: var(--color-surface-elevated);
        }

        .copyable-command:active {
          transform: scale(0.98);
        }

        .copyable-command:focus-visible {
          outline: none;
          box-shadow: var(--shadow-focus);
        }

        .copyable-command__text {
          font: inherit;
        }

        .copyable-command__icon {
          display: inline-flex;
          color: var(--color-fg-muted);
          transition: color var(--duration-fast) var(--ease-out);
        }

        .copyable-command__icon--copied {
          color: var(--color-success);
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
          .copyable-command {
            transition: none;
          }

          .copyable-command:active {
            transform: none;
          }

          .copyable-command__icon {
            transition: none;
          }
        }
      `}</style>
    </button>
  );
}
