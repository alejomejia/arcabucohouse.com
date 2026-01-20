'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks whether a CSS media query matches the current viewport.
 *
 * Returns true when the query matches, false otherwise. Updates automatically
 * when the viewport size changes. SSR-safe - returns false during server-side
 * rendering to prevent hydration mismatches.
 *
 * Uses the modern MediaQueryList.addEventListener API for change detection.
 * Re-runs when the query string changes.
 *
 * @param query - CSS media query string (e.g., '(min-width: 768px)', '(prefers-color-scheme: dark)')
 * @returns Boolean indicating if the media query currently matches
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isMobile = useMediaQuery('(max-width: 767px)')
 *   const isDark = useMediaQuery('(prefers-color-scheme: dark)')
 *
 *   return (
 *     <div>
 *       {isMobile ? <MobileLayout /> : <DesktopLayout />}
 *       {isDark && <DarkModeIndicator />}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * function Sidebar() {
 *   const isWide = useMediaQuery('(min-width: 1024px)')
 *
 *   return (
 *     <aside className={isWide ? 'w-64' : 'w-full'}>
 *       Sidebar content
 *     </aside>
 *   )
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
  // Initialize as false for SSR consistency
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value (only runs on client)
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    }
  }, [query]);

  return matches;
}