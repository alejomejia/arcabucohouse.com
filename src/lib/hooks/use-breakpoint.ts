'use client';

import { useMediaQuery } from './use-media-query';

/**
 * Tracks viewport breakpoints and provides device type flags.
 *
 * Monitors screen width against standard breakpoints (sm: 640px, md: 768px,
 * lg: 1024px, xl: 1280px, 2xl: 1536px) and returns boolean flags for each.
 * Also provides convenience flags for device types (mobile, tablet, desktop).
 * Updates automatically when viewport size changes.
 *
 * Breakpoint values (mobile-first, matches Tailwind):
 * - Small: 640px (sm)
 * - Medium: 768px (md)
 * - Large: 1024px (lg)
 * - Extra Large: 1280px (xl)
 * - Ultra Large: 1536px (2xl)
 *
 * Device type logic (anchored on Tailwind's `md` boundary):
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Desktop: ≥ 1024px
 *
 * @returns Object with breakpoint and device type flags
 * @returns {boolean} isSmallScreen - True if viewport ≥ 640px
 * @returns {boolean} isMediumScreen - True if viewport ≥ 768px
 * @returns {boolean} isLargeScreen - True if viewport ≥ 1024px
 * @returns {boolean} isExtraLargeScreen - True if viewport ≥ 1280px
 * @returns {boolean} isUltraLargeScreen - True if viewport ≥ 1536px
 * @returns {boolean} isMobile - True if viewport < 768px
 * @returns {boolean} isTablet - True if viewport is 768px - 1023px
 * @returns {boolean} isDesktop - True if viewport ≥ 1024px
 *
 * @example
 * ```tsx
 * function ResponsiveLayout() {
 *   const { isMobile, isTablet, isDesktop } = useBreakpoint()
 *
 *   if (isMobile) return <MobileLayout />
 *   if (isTablet) return <TabletLayout />
 *   return <DesktopLayout />
 * }
 * ```
 */
export function useBreakpoint() {
  const isSmallScreen = useMediaQuery('(width >= 640px)');
  const isMediumScreen = useMediaQuery('(width >= 768px)');
  const isLargeScreen = useMediaQuery('(width >= 1024px)');
  const isExtraLargeScreen = useMediaQuery('(width >= 1280px)');
  const isUltraLargeScreen = useMediaQuery('(width >= 1536px)');

  return {
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isExtraLargeScreen,
    isUltraLargeScreen,
    isMobile: !isMediumScreen,
    isTablet: isMediumScreen && !isLargeScreen,
    isDesktop: isLargeScreen,
  };
}