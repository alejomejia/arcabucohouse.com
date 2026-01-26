import { cn } from '@/lib/utils/helpers'

import { HeaderCart } from '@/components/features/cart/header-cart'
import { Container } from '@/components/ui/container'

import { HeaderLogo } from './header-logo'
import { HeaderMiddle } from './header-middle'
import { Navigation } from './navigation'

export function Header() {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50",
      "h-16 py-4",
      "text-lg text-white font-serif font-semibold leading-none",
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
          <HeaderCart />
        </div>
      </Container>
    </header>
  )
}
