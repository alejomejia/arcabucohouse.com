'use client';

import { getCookie, setCookie } from '@/lib/utils/cookies';
import { useEffect, type ReactNode } from 'react';
import { toast, type ToastT as ToastOptions } from 'sonner';

type UseToastOnceOptions = {
  /** Unique toast id (sonner) */
  id: string;

  /** Cookie name used to persist dismissal */
  cookieKey: string;

  /** Version for invalidating old cookies */
  version: number;

  /** Minimum viewport height to show the toast */
  minHeight?: number;

  /** Toast title */
  title: string;

  /** Toast description / JSX */
  description?: ReactNode;

  /** Extra sonner options */
  toastOptions?: Omit<ToastOptions, 'id' | 'description'>;

  /** Cookie duration in seconds (default: 1 year) */
  maxAgeSeconds?: number;
};

/**
 * Displays a toast notification once per user using cookie-based persistence.
 *
 * Client Component hook - requires browser environment for cookies and window.
 * Shows toast only if not previously dismissed (checked via cookie). Supports
 * versioning to re-show toasts after updates. Toast persists until manually
 * dismissed and sets a cookie on dismissal to prevent re-showing.
 *
 * Side effects:
 * - Reads cookie on mount to check dismissal state
 * - Shows toast if conditions met (viewport height, cookie check)
 * - Sets cookie on toast dismissal
 * - Toast duration is infinite (user must dismiss manually)
 *
 * @param options.id - Unique toast identifier for sonner
 * @param options.cookieKey - Cookie name to track dismissal state
 * @param options.version - Version number (increment to invalidate old cookies)
 * @param options.minHeight - Minimum viewport height to show toast (optional)
 * @param options.title - Toast title text
 * @param options.description - Toast description or JSX content (optional)
 * @param options.toastOptions - Additional sonner toast options (optional)
 * @param options.maxAgeSeconds - Cookie expiration in seconds (default: 31536000)
 *
 * @example
 * ```tsx
 * 'use client'
 *
 * function WelcomeToast() {
 *   useToastOnce({
 *     id: 'welcome-toast',
 *     cookieKey: 'welcome-dismissed',
 *     version: 1,
 *     title: 'Welcome!',
 *     description: 'Thanks for visiting our store.',
 *     minHeight: 600,
 *     maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
 *   })
 *   return null
 * }
 * ```
 */
export function useToastOnce({
  id,
  cookieKey,
  version,
  minHeight,
  title,
  description,
  toastOptions,
  maxAgeSeconds = 60 * 60 * 24 * 365, // 1 year
}: UseToastOnceOptions) {
  useEffect(() => {
    // Guard: viewport height
    if (minHeight && window.innerHeight < minHeight) return;

    // Guard: cookie already set
    if (getCookie(cookieKey) === String(version)) return;

    toast(title, {
      id,
      description,
      duration: Infinity,
      ...toastOptions,
      onDismiss: (toast) => {
        setCookie(cookieKey, String(version), {
          maxAge: maxAgeSeconds,
          path: '/',
          sameSite: 'lax',
        });
        toastOptions?.onDismiss?.(toast);
      },
    });
  }, [
    id,
    cookieKey,
    version,
    minHeight,
    title,
    description,
    toastOptions,
    maxAgeSeconds,
  ]);
}