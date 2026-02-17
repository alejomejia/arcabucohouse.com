'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import {
  type AnchorHTMLAttributes,
  type ComponentProps,
  type MouseEvent,
  useEffect,
  useState,
} from 'react'

export type LinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof ComponentProps<typeof NextLink> | 'href'
> &
  Omit<ComponentProps<typeof NextLink>, 'href'> & {
    href: string
    onClick?: (e: MouseEvent<HTMLElement>) => void
    scroll?: boolean
  }

export function Link({
  href,
  children,
  onClick,
  scroll = false, // Default to false to prevent scroll restoration warnings with fixed/sticky elements
  ...props
}: LinkProps) {
  const pathname = usePathname()
  const [shouldPrefetch, setShouldPrefetch] = useState(false)

  const {
    prefetch: prefetchProp,
    replace,
    shallow,
    onMouseEnter,
    onMouseLeave,
    ...restProps
  } = props

  // Determine if link is external synchronously to avoid hydration mismatches
  const isExternalByPattern =
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//')

  const [isExternal, setIsExternal] = useState(isExternalByPattern)

  useEffect(() => {
    if (!isExternalByPattern) {
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
    }

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
  }, [href, isExternalByPattern])

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
