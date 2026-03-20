import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import { CursorProvider } from "@/components/effects/cursor";
import { GSAPRuntime } from "@/components/effects/gsap";
import { CartProvider } from "@/components/features/cart/context";
import { Lenis } from "@/components/layout/lenis";
import { Wrapper } from "@/components/layout/wrapper";
import { Toaster } from "@/components/toast/toaster";
import { PortalRoot } from "@/components/ui/portal/portal-root";
import { getCart } from "@/lib/integrations/shopify/cart";
import { baseUrl } from "@/lib/integrations/utils";
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from "@/lib/seo/metadata";
import { PORTAL_IDS } from "@/lib/styles/const";
import { sans, serif } from "@/lib/styles/fonts";
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
      <body className={cn("font-sans antialiased text-primary-base selection:bg-primary-base selection:text-primary-100", sans.variable, serif.variable)}>
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
        <Toaster closeButton />

        <Suspense>
          <CursorProvider>
            <Lenis root>
              <CartProvider cartPromise={cart}>
                <Wrapper>{children}</Wrapper>
              </CartProvider>
            </Lenis>
          </CursorProvider>
        </Suspense>

        <GSAPRuntime />
        <PortalRoot id={PORTAL_IDS.bodyBottom} />
      </body>
    </html>
  );
}
