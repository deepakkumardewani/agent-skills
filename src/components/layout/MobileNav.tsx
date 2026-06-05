import { useCallback, useEffect, useState } from 'preact/hooks';
import { useDrawerModal } from '../../lib/drawer-modal';
import {
  isSkillActive,
  MOBILE_NAV_MEDIA_QUERY,
  shouldShowMobileNav,
  skillHref,
} from '../../lib/mobile-nav';
import {
  formatSkillDisplayName,
  getPhaseMeta,
  groupSkillsByPhase,
  sortSkillsAlphabetically,
} from '../../lib/skills';

function MenuIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function MobileNav() {
  const groups = groupSkillsByPhase();
  const [isOpen, setIsOpen] = useState(false);
  const [pathname, setPathname] = useState('');
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const showNav = shouldShowMobileNav(pathname, isMobileViewport);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const { drawerRef, captureTriggerFocus, trapFocus } = useDrawerModal({
    isOpen,
    onClose: close,
    focusOnOpen: '[data-mobile-nav-close]',
  });

  const open = useCallback(() => {
    captureTriggerFocus();
    setIsOpen(true);
  }, [captureTriggerFocus]);

  useEffect(() => {
    setPathname(window.location.pathname);

    const media = window.matchMedia(MOBILE_NAV_MEDIA_QUERY);
    const syncViewport = () => setIsMobileViewport(media.matches);
    syncViewport();
    media.addEventListener('change', syncViewport);
    return () => media.removeEventListener('change', syncViewport);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('has-mobile-skills-nav', showNav);
    return () => document.documentElement.classList.remove('has-mobile-skills-nav');
  }, [showNav]);

  if (!showNav) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="mobile-nav__trigger"
        aria-label="Open skills navigation"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        onClick={open}
      >
        <MenuIcon />
      </button>

      {isOpen ? (
        <div className="mobile-nav">
          <button
            type="button"
            className="mobile-nav__backdrop"
            aria-label="Close skills navigation"
            onClick={close}
          />
          <div
            id="mobile-nav-drawer"
            ref={drawerRef}
            className="mobile-nav__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Skills navigation"
            onKeyDown={trapFocus}
          >
            <div className="mobile-nav__header">
              <span className="mobile-nav__title">Skills</span>
              <button
                type="button"
                className="mobile-nav__close"
                data-mobile-nav-close
                aria-label="Close skills navigation"
                onClick={close}
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="mobile-nav__sidebar" aria-label="Skills by lifecycle phase">
              {groups.map((group, groupIndex) => {
                const meta = getPhaseMeta(group.phase);
                const skills = sortSkillsAlphabetically(group.skills);

                return (
                  <section
                    key={group.phase}
                    className="mobile-nav__section"
                    aria-labelledby={`mobile-nav-group-${group.phase}`}
                  >
                    <h2
                      id={`mobile-nav-group-${group.phase}`}
                      className={`mobile-nav__label${groupIndex === 0 ? ' mobile-nav__label--first' : ''}`}
                    >
                      {meta.label}
                      {meta.command ? (
                        <code className="mobile-nav__command">{meta.command}</code>
                      ) : null}
                    </h2>
                    <ul className="mobile-nav__list">
                      {skills.map((skill) => {
                        const active = isSkillActive(pathname, skill.slug);
                        return (
                          <li key={skill.slug}>
                            <a
                              href={skillHref(skill.slug)}
                              className={`mobile-nav__item${active ? ' mobile-nav__item--active' : ''}`}
                              aria-current={active ? 'page' : undefined}
                              onClick={close}
                            >
                              {formatSkillDisplayName(skill.name)}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}

      <style>{`
        .mobile-nav__trigger {
          flex-shrink: 0;
        }

        .mobile-nav {
          position: fixed;
          inset: 0;
          z-index: 60;
        }

        .mobile-nav__backdrop {
          position: absolute;
          inset: 0;
          border: 0;
          padding: 0;
          background: color-mix(in srgb, var(--color-fg-default) 40%, transparent);
          cursor: pointer;
        }

        .mobile-nav__panel {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          width: min(var(--space-sidebar-width), 85vw);
          max-width: 100%;
          height: 100%;
          border-right: 1px solid var(--color-outline);
          background: var(--color-bg-default);
          box-shadow: var(--shadow-md);
          transform: translateX(0);
          animation: mobile-nav-slide-in var(--duration-base) var(--ease-out);
        }

        .mobile-nav__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--color-outline);
        }

        .mobile-nav__title {
          font-size: var(--text-label-md-size);
          font-weight: var(--text-label-md-weight);
          line-height: var(--text-label-md-line-height);
          color: var(--color-fg-default);
        }

        .mobile-nav__close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          min-height: 40px;
          padding: 0;
          border: none;
          border-radius: var(--radius-default);
          background: transparent;
          color: var(--color-fg-muted);
          cursor: pointer;
          transition: color var(--duration-fast) var(--ease-out);
        }

        .mobile-nav__close:hover {
          color: var(--color-fg-default);
        }

        .mobile-nav__close:focus-visible {
          outline: none;
          box-shadow: var(--shadow-focus);
        }

        .mobile-nav__sidebar {
          flex: 1;
          overflow-y: auto;
          padding: var(--space-4);
        }

        .mobile-nav__label {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: var(--space-2);
          margin-top: var(--space-6);
          margin-bottom: var(--space-2);
          padding-inline: var(--space-3);
          font-size: var(--text-caps-xs-size);
          font-weight: 700;
          line-height: var(--text-caps-xs-line-height);
          letter-spacing: var(--text-caps-xs-letter-spacing);
          text-transform: uppercase;
          color: var(--color-fg-subtle);
        }

        .mobile-nav__label--first {
          margin-top: 0;
        }

        .mobile-nav__command {
          font-family: var(--font-mono);
          font-size: var(--text-code-sm-size);
          font-weight: var(--text-code-sm-weight);
          line-height: var(--text-code-sm-line-height);
          letter-spacing: var(--text-code-sm-letter-spacing);
          text-transform: none;
          color: inherit;
        }

        .mobile-nav__list {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .mobile-nav__item {
          display: block;
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-default);
          font-size: var(--text-body-sm-size);
          font-weight: var(--text-body-sm-weight);
          line-height: var(--text-body-sm-line-height);
          color: var(--color-fg-default);
          text-decoration: none;
          transition:
            background-color var(--duration-fast) var(--ease-out),
            color var(--duration-fast) var(--ease-out);
        }

        .mobile-nav__item:hover {
          background: var(--color-surface-elevated);
          color: var(--color-fg-default);
        }

        .mobile-nav__item:focus-visible {
          outline: none;
          box-shadow: var(--shadow-focus);
        }

        .mobile-nav__item--active {
          background: var(--color-primary-subtle);
          color: var(--color-on-primary-subtle);
        }

        .mobile-nav__item--active:hover {
          background: var(--color-primary-subtle);
          color: var(--color-on-primary-subtle);
        }

        @keyframes mobile-nav-slide-in {
          from {
            transform: translateX(-100%);
          }

          to {
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mobile-nav__close,
          .mobile-nav__item {
            transition: none;
          }

          .mobile-nav__panel {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
