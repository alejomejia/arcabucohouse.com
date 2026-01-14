import { GeistSans } from 'geist/font/sans'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'

import { CartProvider } from '@/components/from-template/cart/cart-context'
import { Navbar } from '@/components/from-template/layout/navbar'
import { WelcomeToast } from '@/components/from-template/welcome-toast'
import { getCart } from '@/lib/integrations/shopify'
import { baseUrl } from '@/lib/integrations/utils'

import { GSAPRuntime } from '@/components/effects/gsap'
import { Lenis } from '@/components/layout/lenis'
import '@/lib/styles/globals.css'

const { SITE_NAME } = process.env

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart()

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="antialiased bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <CartProvider cartPromise={cart}>
          <Navbar />
          <main>
            {children}
            <Toaster closeButton />
            <WelcomeToast />
          </main>
        </CartProvider>

        <GSAPRuntime />
        <Lenis root options={{}} />
      </body>
    </html>
  )
}
