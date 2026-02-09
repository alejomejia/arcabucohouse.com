import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { CursorProvider } from "@/components/effects/cursor";
import { GSAPRuntime } from "@/components/effects/gsap";
import { CartProvider } from "@/components/features/cart/context";
import { Lenis } from "@/components/layout/lenis";
import { Wrapper } from "@/components/layout/wrapper";
import { PortalRoot } from "@/components/ui/portal/portal-root";
import { PreloaderProvider } from "@/components/ui/preloader/hooks/preloader-context";
import { PreloaderGate } from "@/components/ui/preloader/preloader-gate";
import { getCart } from "@/lib/integrations/shopify";
import { baseUrl } from "@/lib/integrations/utils";
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
  },
};

export default async function RootLayout({
  children,
}: { children: ReactNode }) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en">
      <body className={cn("font-sans antialiased text-primary-base", sans.variable, serif.variable)}>
        <PortalRoot id={PORTAL_IDS.bodyTop} />
        <Toaster closeButton />

        <PreloaderProvider>
          <PreloaderGate />
          <CursorProvider>
            <Lenis root>
              <CartProvider cartPromise={cart}>
                <Wrapper>{children}</Wrapper>
              </CartProvider>
            </Lenis>
          </CursorProvider>
        </PreloaderProvider>

        <GSAPRuntime />
        <PortalRoot id={PORTAL_IDS.bodyBottom} />
      </body>
    </html>
  );
}
