import { useEffect, useState } from "react"

/**
 * Returns whether the given href points to an external origin.
 *
 * Hydration-safe: absolute URLs (http/https/protocol-relative) are known synchronously;
 * relative URLs are resolved against window.location in useEffect.
 *
 * @param href - Link href (relative or absolute)
 * @returns true if the URL's host differs from the current host
 *
 * @example
 * ```tsx
 * const isExternal = useIsExternal(href)
 * const cursorVariant = isExternal ? 'external' : 'internal'
 * ```
 */
export function useIsExternal(href: string): boolean {
  const isExternalByPattern =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//")

  const [isExternal, setIsExternal] = useState(isExternalByPattern)

  useEffect(() => {
    if (isExternalByPattern) return

    if (href.startsWith('mailto:')) {
      setIsExternal(false)
      return
    }

    try {
      const url = new URL(href, window.location.href)
      setIsExternal(url.host !== window.location.host)
    } catch {
      setIsExternal(false)
    }
  }, [href, isExternalByPattern])

  return isExternal
}
