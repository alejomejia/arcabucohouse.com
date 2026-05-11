'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { type ComponentProps, useEffect, useState } from 'react'

import { isExternalByPattern } from './link.helpers'
import type { LinkProps } from './link.types'
import { useLinkPrefetch } from './use-link-prefetch'

/**
 * Anchor primitive that picks the right element for the destination:
 *
 * - **External URLs** (absolute `http(s):`, protocol-relative `//`, or any
 *   resolved URL whose host differs from `window.location.host`) render a
 *   plain `<a>` with `target="_blank"` and `rel="noopener noreferrer"`.
 * - **Internal routes** render `next/link` with `data-active` reflecting
 *   the current pathname and **adaptive prefetching** — prefetch is
 *   disabled on slow or Data-Saver connections via {@link useLinkPrefetch},
 *   falling back to enabled when the Network Information API isn't
 *   available.
 *
 * `scroll` defaults to `false` to avoid `next/link`'s scroll-restoration
 * warnings on pages with fixed/sticky elements.
 *
 * @example
 * ```tsx
 * <Link href="/category/curtains">Curtains</Link>
 * <Link href="https://shopify.com">Shopify</Link>
 * <Link href="mailto:hello@arcabucohouse.com">hello@arcabucohouse.com</Link>
 * ```
 */
export function Link({
  href,
  children,
  onClick,
  scroll = false,
  ...props
}: LinkProps) {
  const pathname = usePathname()
  const shouldPrefetch = useLinkPrefetch()

  const {
    prefetch: prefetchProp,
    replace,
    shallow,
    onMouseEnter,
    onMouseLeave,
    ...restProps
  } = props

  // Seed with the SSR-safe pattern check so the first render matches the
  // server output and avoids a hydration mismatch on absolute-URL hrefs.
  const [isExternal, setIsExternal] = useState(isExternalByPattern(href))

  useEffect(() => {
    if (isExternalByPattern(href)) return

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
  }, [href])

  const isActive = pathname === href

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-external
        {...restProps}
      >
        {children}
      </a>
    )
  }

  return (
    <NextLink
      href={href as ComponentProps<typeof NextLink>['href']}
      prefetch={shouldPrefetch}
      scroll={scroll}
      data-active={isActive}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...(onClick && { onClick })}
      {...restProps}
    >
      {children}
    </NextLink>
  )
}

export type * from './link.types'
