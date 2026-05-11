import type NextLink from 'next/link'
import type { AnchorHTMLAttributes, ComponentProps, MouseEvent } from 'react'

export type LinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof ComponentProps<typeof NextLink> | 'href'
> &
  Omit<ComponentProps<typeof NextLink>, 'href'> & {
    href: string
    onClick?: (e: MouseEvent<HTMLElement>) => void
    scroll?: boolean
  }
