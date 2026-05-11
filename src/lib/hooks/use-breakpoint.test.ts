import { renderHook } from '@testing-library/react'

import { useBreakpoint } from './use-breakpoint'

/**
 * Tailwind breakpoint pixel values, kept in sync with `use-breakpoint.ts`.
 * Tests pin the inversion guarantee called out in PLAN §0.5.
 */
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

/**
 * Installs a `window.matchMedia` mock that matches min-width queries against
 * the supplied viewport width. Returns the mock so tests can restore later.
 */
function mockMatchMedia(width: number) {
  const matchMedia = jest.fn().mockImplementation((query: string) => {
    const match = /\(width\s*>=\s*(\d+)px\)/.exec(query)
    const min = match ? Number(match[1]) : Number.POSITIVE_INFINITY
    return {
      matches: width >= min,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }
  })

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMedia,
  })

  return matchMedia
}

describe('useBreakpoint', () => {
  it('reports mobile when viewport is below md (e.g. 500px)', () => {
    mockMatchMedia(500)
    const { result } = renderHook(() => useBreakpoint())

    expect(result.current.isSmallScreen).toBe(false)
    expect(result.current.isMediumScreen).toBe(false)
    expect(result.current.isLargeScreen).toBe(false)
    expect(result.current.isMobile).toBe(true)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(false)
  })

  it('reports tablet at md (768px) — boundary case', () => {
    mockMatchMedia(BREAKPOINTS.md)
    const { result } = renderHook(() => useBreakpoint())

    expect(result.current.isMediumScreen).toBe(true)
    expect(result.current.isLargeScreen).toBe(false)
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(true)
    expect(result.current.isDesktop).toBe(false)
  })

  it('reports desktop at lg (1024px) and isMobile=false', () => {
    mockMatchMedia(BREAKPOINTS.lg)
    const { result } = renderHook(() => useBreakpoint())

    expect(result.current.isLargeScreen).toBe(true)
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(true)
  })

  it('reports all breakpoints true at 2xl (1536px)', () => {
    mockMatchMedia(BREAKPOINTS['2xl'])
    const { result } = renderHook(() => useBreakpoint())

    expect(result.current.isSmallScreen).toBe(true)
    expect(result.current.isMediumScreen).toBe(true)
    expect(result.current.isLargeScreen).toBe(true)
    expect(result.current.isExtraLargeScreen).toBe(true)
    expect(result.current.isUltraLargeScreen).toBe(true)
    expect(result.current.isDesktop).toBe(true)
  })

  it('isMobile and isDesktop are mutually exclusive at every tested width', () => {
    for (const width of [320, 500, 640, 768, 900, 1024, 1280, 1536, 1800]) {
      mockMatchMedia(width)
      const { result, unmount } = renderHook(() => useBreakpoint())

      const { isMobile, isDesktop } = result.current
      expect(isMobile && isDesktop).toBe(false)

      unmount()
    }
  })
})
