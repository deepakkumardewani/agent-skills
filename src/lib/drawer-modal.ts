import type { JSX, RefObject } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';

export const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface UseDrawerModalOptions {
  isOpen: boolean;
  onClose: () => void;
  focusOnOpen?: RefObject<HTMLElement | null> | string;
  closeOnEscape?: boolean;
}

export function useDrawerModal({
  isOpen,
  onClose,
  focusOnOpen,
  closeOnEscape = true,
}: UseDrawerModalOptions) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const captureTriggerFocus = useCallback(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
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
      if (typeof focusOnOpen === 'string') {
        drawerRef.current?.querySelector<HTMLElement>(focusOnOpen)?.focus();
        return;
      }
      focusOnOpen?.current?.focus();
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
  }, [focusOnOpen, isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEscape, isOpen, onClose]);

  const trapFocus = useCallback((event: JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
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
  }, []);

  return { drawerRef, captureTriggerFocus, trapFocus };
}
