import { Suspense } from 'react'

import { HeaderCart } from '@/components/features/cart/header-cart'
import { Container } from '@/components/ui/container'
import { Z_INDEX_CLASSNAMES } from '@/lib/styles/const'
import { cn } from '@/lib/utils/helpers'

import { HeaderLogo } from './header-logo'
import { HeaderMiddle } from './header-middle'
import { Navigation } from './navigation'

/**
 * Site-wide top header: fixed full-width row with the wordmark on the
 * left, the active section/menu in the middle, and navigation + cart on
 * the right. Always renders the same three slots, so the sub-components
 * stay private — there's only one consumer (`app/layout.tsx`) and no
 * composition need that would justify exposing a compound API.
 *
 * @example
 * ```tsx
 * <body>
 *   <Header />
 *   {children}
 * </body>
 * ```
 */
export function Header() {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0",
      Z_INDEX_CLASSNAMES.header,
      "h-16 py-4",
      "text-lg text-zinc-100 font-semibold leading-none",
      "select-none mix-blend-difference",
    )}>
      <Container className="flex justify-between items-center gap-4 md:gap-12">
        <div className="md:flex-1">
          <HeaderLogo />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <HeaderMiddle />
        </div>
        <div className="md:flex-1 flex justify-end items-center gap-3 md:gap-4">
          <Navigation />
          <Suspense fallback={null}>
            <HeaderCart />
          </Suspense>
        </div>
      </Container>
    </header>
  )
}
