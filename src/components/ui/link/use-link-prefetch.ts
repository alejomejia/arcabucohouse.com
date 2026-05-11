'use client'

import { useEffect, useState } from 'react'

/**
 * Returns whether Next.js link prefetching should be enabled for the
 * current network conditions:
 *
 * - **Network Information API available** — prefetch only on 4G without
 *   Data Saver. Slow or metered connections opt out.
 * - **API unavailable** — fall back to prefetch enabled, matching the
 *   `next/link` default.
 *
 * The decision is captured once on mount and does not react to mid-session
 * connection changes (acceptable trade-off for short page sessions; revisit
 * if route transitions start lasting long enough for connections to shift).
 *
 * @example
 * ```tsx
 * function NavLink({ href, children }) {
 *   const shouldPrefetch = useLinkPrefetch()
 *   return <NextLink href={href} prefetch={shouldPrefetch}>{children}</NextLink>
 * }
 * ```
 */
export function useLinkPrefetch(): boolean {
  const [shouldPrefetch, setShouldPrefetch] = useState(false)

  useEffect(() => {
    const connection = (
      navigator as Navigator & {
        connection?: { effectiveType: string; saveData: boolean }
      }
    ).connection

    if (connection) {
      const { effectiveType, saveData } = connection
      setShouldPrefetch(effectiveType === '4g' && !saveData)
    } else {
      setShouldPrefetch(true)
    }
  }, [])

  return shouldPrefetch
}
