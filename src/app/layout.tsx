import { ReactNode } from 'react'
import { Toaster } from 'sonner'

import { CartProvider } from '@/components/features/cart/cart-context'
import { getCart } from '@/lib/integrations/shopify'
import { baseUrl } from '@/lib/integrations/utils'

import { GSAPRuntime } from '@/components/effects/gsap'
import { Lenis } from '@/components/layout/lenis'
import { Wrapper } from '@/components/layout/wrapper'
import { PORTAL_IDS } from '@/lib/styles/const'
import { sans, serif } from '@/lib/styles/fonts'
import '@/lib/styles/globals.css'
import { assertRequiredEnvVars } from '@/lib/utils/config'
import { cn } from '@/lib/utils/helpers'

const { SITE_NAME } = process.env

// Validate required environment variables at application startup
// This will fail fast during build or at runtime if any are missing
assertRequiredEnvVars()

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
    <html lang="en" className={cn(sans.variable, serif.variable)}>
      <body className="font-sans antialiased bg-neutral-50 text-black">
        <div id={PORTAL_IDS.bodyTop} />
        <Toaster closeButton />

        <CartProvider cartPromise={cart}>
          <Wrapper>
            {children}
          </Wrapper>
        </CartProvider>

        <GSAPRuntime />
        <Lenis root />
        <div id={PORTAL_IDS.bodyBottom} />
      </body>
    </html>
  )
}
