import type { JSX } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { MOBILE_NAV_MEDIA_QUERY, shouldShowSiteNavMenu } from '../../lib/mobile-nav';

const NAV_ITEMS = [
  { href: '/docs', label: 'Docs' },
  { href: '/quickstart', label: 'Quick start' },
  { href: '/about', label: 'About' },
] as const;

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function MenuToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span className={`site-nav-menu__icon${isOpen ? ' site-nav-menu__icon--open' : ''}`}>
      <span />
      <span />
      <span />
    </span>
  );
}

function isNavActive(pathname: string, href: string): boolean {
  if (href === '/docs') {
    return pathname.startsWith('/docs');
  }
  return pathname === href;
}

export default function SiteNavMenu() {
  const [isMounted, setIsMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [pathname, setPathname] = useState('');
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const isOpen = isMounted && isActive;
  const showMenu = shouldShowSiteNavMenu(pathname, isMobileViewport);

  const close = useCallback(() => {
    setIsActive(false);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsMounted(false);
    }
  }, []);

  const open = useCallback(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsMounted(true);
    window.requestAnimationFrame(() => {
      setIsActive(true);
    });
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
      return;
    }
    open();
  }, [close, isOpen, open]);

  useEffect(() => {
    setPathname(window.location.pathname);

    const media = window.matchMedia(MOBILE_NAV_MEDIA_QUERY);
    const syncViewport = () => setIsMobileViewport(media.matches);
    syncViewport();
    media.addEventListener('change', syncViewport);
    return () => media.removeEventListener('change', syncViewport);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      previousFocusRef.current?.focus();
      return;
    }

    const scrollY = window.scrollY;
    const { style: htmlStyle } = document.documentElement;
    const { style: bodyStyle } = document.body;
    const previousHtmlOverflow = htmlStyle.overflow;
    const previousBodyOverflow = bodyStyle.overflow;
    const previousBodyPosition = bodyStyle.position;
    const previousBodyTop = bodyStyle.top;
    const previousBodyWidth = bodyStyle.width;

    htmlStyle.overflow = 'hidden';
    bodyStyle.overflow = 'hidden';
    bodyStyle.position = 'fixed';
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = '100%';

    const frame = window.requestAnimationFrame(() => {
      drawerRef.current?.querySelector<HTMLElement>('[data-site-nav-close]')?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      htmlStyle.overflow = previousHtmlOverflow;
      bodyStyle.overflow = previousBodyOverflow;
      bodyStyle.position = previousBodyPosition;
      bodyStyle.top = previousBodyTop;
      bodyStyle.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [close, isOpen]);

  function handlePanelTransitionEnd(event: JSX.TargetedTransitionEvent<HTMLDivElement>) {
    if (event.propertyName !== 'transform' || isActive) {
      return;
    }
    setIsMounted(false);
  }

  function trapFocus(event: JSX.TargetedKeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab' || !drawerRef.current) {
      return;
    }

    const focusable = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((element) => element.offsetParent !== null);

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last?.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!showMenu) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className={`mobile-nav__trigger site-nav-menu__trigger${isOpen ? ' site-nav-menu__trigger--open' : ''}`}
        aria-label={isOpen ? 'Close site menu' : 'Open site menu'}
        aria-expanded={isOpen}
        aria-controls="site-nav-drawer"
        onClick={toggle}
      >
        <MenuToggleIcon isOpen={isOpen} />
      </button>

      {isMounted ? (
        <div className={`site-nav-menu${isActive ? ' site-nav-menu--open' : ''}`}>
          <button
            type="button"
            className="site-nav-menu__backdrop"
            aria-label="Close site menu"
            onClick={close}
          />
          <div
            id="site-nav-drawer"
            ref={drawerRef}
            className="site-nav-menu__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            onKeyDown={trapFocus}
            onTransitionEnd={handlePanelTransitionEnd}
          >
            <div className="site-nav-menu__header">
              <a className="site-nav-menu__brand" href="/" onClick={close}>
                <span className="site-nav-menu__mark" aria-hidden="true" />
                <span className="site-nav-menu__wordmark">
                  <span className="site-nav-menu__wordmark-base">addy-osmani:</span>
                  <span className="site-nav-menu__wordmark-accent">agent-skills</span>
                </span>
              </a>
              <button
                type="button"
                className="site-nav-menu__close"
                data-site-nav-close
                aria-label="Close site menu"
                onClick={close}
              >
                <MenuToggleIcon isOpen />
              </button>
            </div>
            <nav className="site-nav-menu__nav" aria-label="Primary">
              <ul className="site-nav-menu__list">
                {NAV_ITEMS.map((item) => {
                  const active = isNavActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <a
                        className={`site-nav-menu__link${active ? ' site-nav-menu__link--active' : ''}`}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        onClick={close}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}

      <style>{`
        .site-nav-menu__trigger {
          transition: color var(--duration-fast) var(--ease-out);
        }

        .site-nav-menu__icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
        }

        .site-nav-menu__icon span {
          position: absolute;
          left: 0;
          width: 18px;
          height: 2px;
          border-radius: var(--radius-sm);
          background: currentColor;
          transition:
            transform var(--duration-base) var(--ease-out),
            opacity var(--duration-fast) var(--ease-out);
        }

        .site-nav-menu__icon span:nth-child(1) {
          transform: translateY(-6px);
        }

        .site-nav-menu__icon span:nth-child(2) {
          transform: translateY(0);
        }

        .site-nav-menu__icon span:nth-child(3) {
          transform: translateY(6px);
        }

        .site-nav-menu__icon--open span:nth-child(1) {
          transform: translateY(0) rotate(45deg);
        }

        .site-nav-menu__icon--open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0.6);
        }

        .site-nav-menu__icon--open span:nth-child(3) {
          transform: translateY(0) rotate(-45deg);
        }

        .site-nav-menu {
          position: fixed;
          inset: 0;
          z-index: 60;
          pointer-events: none;
        }

        .site-nav-menu--open {
          pointer-events: auto;
        }

        .site-nav-menu__backdrop {
          position: absolute;
          inset: 0;
          border: none;
          background: color-mix(in srgb, var(--color-fg-default) 35%, transparent);
          opacity: 0;
          cursor: pointer;
          transition: opacity var(--duration-base) var(--ease-out);
        }

        .site-nav-menu--open .site-nav-menu__backdrop {
          opacity: 1;
        }

        .site-nav-menu__panel {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          width: min(18rem, 85vw);
          height: 100%;
          border-right: 1px solid var(--color-outline);
          background: var(--color-bg-default);
          box-shadow: var(--shadow-lg);
          transform: translateX(-100%);
          transition: transform var(--duration-slow) var(--ease-out);
          will-change: transform;
        }

        .site-nav-menu--open .site-nav-menu__panel {
          transform: translateX(0);
        }

        .site-nav-menu__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          padding: var(--space-4);
          border-bottom: 1px solid var(--color-outline);
        }

        .site-nav-menu__brand {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          flex: 1;
          min-width: 0;
          text-decoration: none;
          color: var(--color-fg-default);
        }

        .site-nav-menu__close {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          min-height: 40px;
          border: none;
          border-radius: var(--radius-default);
          background: transparent;
          color: var(--color-fg-muted);
          cursor: pointer;
          transition: color var(--duration-fast) var(--ease-out);
        }

        .site-nav-menu__close:hover {
          color: var(--color-fg-default);
        }

        .site-nav-menu__close:focus-visible {
          outline: none;
          box-shadow: var(--shadow-focus);
        }

        .site-nav-menu__brand:focus-visible {
          outline: none;
          box-shadow: var(--shadow-focus);
          border-radius: var(--radius-sm);
        }

        .site-nav-menu__mark {
          flex-shrink: 0;
          width: var(--space-2);
          height: var(--space-5);
          border-radius: var(--radius-sm);
          background: linear-gradient(
            180deg,
            var(--color-accent) 0%,
            color-mix(in srgb, var(--color-accent) 55%, var(--color-fg-muted)) 100%
          );
        }

        .site-nav-menu__wordmark {
          display: inline-flex;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: var(--text-label-md-size);
          font-weight: var(--text-label-md-weight);
          line-height: var(--text-label-md-line-height);
          letter-spacing: var(--text-label-md-letter-spacing);
        }

        .site-nav-menu__wordmark-base {
          color: var(--color-fg-default);
        }

        .site-nav-menu__wordmark-accent {
          color: var(--color-link);
          font-weight: 600;
        }

        .site-nav-menu__nav {
          padding: var(--space-4);
        }

        .site-nav-menu__list {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .site-nav-menu__link {
          display: flex;
          align-items: center;
          min-height: 44px;
          padding: 0 var(--space-3);
          border-radius: var(--radius-default);
          color: var(--color-fg-muted);
          font-size: var(--text-label-md-size);
          font-weight: var(--text-label-md-weight);
          text-decoration: none;
          transition: background-color var(--duration-fast) var(--ease-out),
            color var(--duration-fast) var(--ease-out);
        }

        .site-nav-menu__link:hover {
          background: var(--color-surface-elevated);
          color: var(--color-fg-default);
        }

        .site-nav-menu__link:focus-visible {
          outline: none;
          box-shadow: var(--shadow-focus);
        }

        .site-nav-menu__link--active {
          background: var(--color-primary-subtle);
          color: var(--color-on-primary-subtle);
        }

        @media (prefers-reduced-motion: reduce) {
          .site-nav-menu__icon span,
          .site-nav-menu__backdrop,
          .site-nav-menu__panel,
          .site-nav-menu__link,
          .site-nav-menu__trigger,
          .site-nav-menu__close {
            transition: none;
          }

          .site-nav-menu__panel {
            transform: none;
          }

          .site-nav-menu:not(.site-nav-menu--open) .site-nav-menu__panel {
            visibility: hidden;
          }
        }
      `}</style>
    </>
  );
}
