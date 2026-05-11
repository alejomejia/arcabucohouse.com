/**
 * Synchronous check for whether an href targets an external origin based
 * purely on URL syntax (absolute protocol or protocol-relative). Safe for
 * SSR — does not touch `window`. The full host-comparison check requires
 * a client-side runtime and lives in the `Link` component itself.
 *
 * @example
 * ```ts
 * isExternalByPattern('https://example.com') // true
 * isExternalByPattern('//cdn.example.com')   // true
 * isExternalByPattern('/about')              // false
 * ```
 */
export function isExternalByPattern(href: string): boolean {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//')
  )
}
