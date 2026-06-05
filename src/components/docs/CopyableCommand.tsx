import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

const COPIED_DURATION_MS = 1200;

interface Props {
  command: string;
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12l4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CopyableCommand({ command }: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, COPIED_DURATION_MS);
    } catch {
      // Clipboard may be unavailable; leave UI unchanged
    }
  }, [command]);

  return (
    <div class="copyable-command" data-copyable-command>
      <code class="copyable-command__text">{command}</code>
      <button
        type="button"
        class="copyable-command__button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy command'}
      >
        <span class="copyable-command__icon" aria-hidden="true">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </span>
      </button>
      <style>{`
        .copyable-command {
          display: flex;
          align-items: stretch;
          gap: 0;
          margin-top: var(--space-3);
          border: 1px solid var(--color-outline);
          border-radius: var(--radius-default);
          background: var(--color-code-bg);
          overflow: hidden;
        }

        .copyable-command__text {
          flex: 1;
          min-width: 0;
          margin: 0;
          padding: var(--space-2) var(--space-3);
          font-family: var(--font-mono);
          font-size: var(--text-code-md-size);
          line-height: var(--text-code-md-line-height);
          color: var(--color-code-fg);
          white-space: pre-wrap;
          word-break: break-word;
          background: transparent;
        }

        .copyable-command__button {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          padding: 0 var(--space-2);
          border: none;
          border-left: 1px solid var(--color-outline);
          background: transparent;
          color: var(--color-fg-muted);
          cursor: pointer;
          transition: color var(--duration-fast) var(--ease-out),
            background-color var(--duration-fast) var(--ease-out);
        }

        .copyable-command__button:hover {
          color: var(--color-fg-default);
          background: var(--color-surface-elevated);
        }

        .copyable-command__button:focus-visible {
          outline: none;
          box-shadow: inset var(--shadow-focus);
        }

        .copyable-command__icon {
          display: inline-flex;
        }

        @media (prefers-reduced-motion: reduce) {
          .copyable-command__button {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
