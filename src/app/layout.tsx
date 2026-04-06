import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import { CursorProvider } from "@/components/effects/cursor";
import { GSAPRuntime } from "@/components/effects/gsap";
import { CartProvider } from "@/components/features/cart/context";
import { Lenis } from "@/components/layout/lenis";
import { Toaster } from "@/components/toast/toaster";
import { PortalRoot } from "@/components/ui/portal/portal-root";
import { getCart } from "@/lib/integrations/shopify/cart";
import { baseUrl } from "@/lib/integrations/utils";
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from "@/lib/seo/metadata";
import { PORTAL_IDS } from "@/lib/styles/const";
import { sans } from "@/lib/styles/fonts";
import "@/lib/styles/globals.css";
import { assertRequiredEnvVars, config } from "@/lib/utils/config";
import { cn } from "@/lib/utils/helpers";

const { siteName } = config;

// Validate required environment variables at application startup
// This will fail fast during build or at runtime if any are missing
assertRequiredEnvVars();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteName!,
    template: `%s | ${siteName}`,
  },
  robots: {
    follow: true,
    index: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: { children: ReactNode }) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  const organizationJsonLd = generateOrganizationJsonLd()
  const webSiteJsonLd = generateWebSiteJsonLd()

  return (
    <html lang="en">
      <body className={cn("font-sans antialiased text-zinc-700 selection:bg-zinc-900 selection:text-zinc-200", sans.variable)}>
        {/* Global structured data — rendered on every page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <PortalRoot id={PORTAL_IDS.bodyTop} />
        <Suspense>
          <Toaster closeButton />
        </Suspense>

        <Suspense>
          <CursorProvider>
            <Lenis root>
              <CartProvider cartPromise={cart}>
                {children}
              </CartProvider>
            </Lenis>
          </CursorProvider>
        </Suspense>

        <Suspense>
          <GSAPRuntime />
        </Suspense>
        <PortalRoot id={PORTAL_IDS.bodyBottom} />
      </body>
    </html>
  );
}
