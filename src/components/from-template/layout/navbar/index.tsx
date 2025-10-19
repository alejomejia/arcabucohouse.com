import Link from 'next/link'
import { Suspense } from 'react'

import CartModal from '@/components/from-template/cart/modal'
import LogoSquare from '@/components/from-template/logo-square'
import { getMenu } from '@/integrations/shopify'
import { SHOPIFY_MENU_HANDLERS } from '@/integrations/shopify/const'
import { Menu } from '@/integrations/shopify/types'

import { UnderlineLink } from '@/shared/ui/link'
import MobileMenu from './mobile-menu'
import Search, { SearchSkeleton } from './search'

const { SITE_NAME } = process.env

export async function Navbar() {
  const menu = await getMenu(SHOPIFY_MENU_HANDLERS.main)

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center justify-between gap-6">
        <div className="flex">
          <Link href="/" prefetch={true} className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">{SITE_NAME}</div>
          </Link>

          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <UnderlineLink href={item.path} prefetch={true}>
                    {item.title}
                  </UnderlineLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex items-center justify-end gap-6 flex-1">
          <div className="hidden justify-center md:flex md:max-w-96 flex-1">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          <div className="flex">
            <CartModal />
          </div>
        </div>
      </div>
    </nav>
  )
}
