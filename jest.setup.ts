// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/'
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  }
}))

// Global mock for the cursor context. The custom-cursor effect is purely
// visual — components like the cart submit buttons consume `useCursor()`
// to toggle hover states, but unit tests render those components in
// isolation without a `<CursorProvider>`. Returning a no-op implementation
// here lets the components mount cleanly while we still assert behavior.
jest.mock('@/components/effects/cursor/cursor.context', () => ({
  useCursor: () => ({
    setHover: jest.fn(),
    setDefault: jest.fn(),
    hide: jest.fn(),
    show: jest.fn(),
    cursorState: { state: 'default', config: {} },
  }),
  CursorContext: { Provider: ({ children }: { children: React.ReactNode }) => children },
}))
