import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { CursorProvider } from "@/components/effects/cursor";
import { GSAPRuntime } from "@/components/effects/gsap";
import { CartProvider } from "@/components/features/cart/context";
import { Lenis } from "@/components/layout/lenis";
import { Wrapper } from "@/components/layout/wrapper";
import { PortalRoot } from "@/components/ui/portal/portal-root";
import { getCart } from "@/lib/integrations/shopify";
import { baseUrl } from "@/lib/integrations/utils";
import { PORTAL_IDS } from "@/lib/styles/const";
import { sans, serif } from "@/lib/styles/fonts";
import "@/lib/styles/globals.css";
import { assertRequiredEnvVars } from "@/lib/utils/config";
import { cn } from "@/lib/utils/helpers";

const { SITE_NAME } = process.env;

// Validate required environment variables at application startup
// This will fail fast during build or at runtime if any are missing
assertRequiredEnvVars();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
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
      <body className={cn("font-sans antialiased bg-neutral-50 text-primary-base", sans.variable, serif.variable)}>
        <PortalRoot id={PORTAL_IDS.bodyTop} />
        <Toaster closeButton />

        <CursorProvider>
          <Lenis root>
            <CartProvider cartPromise={cart}>
              <Wrapper>{children}</Wrapper>
            </CartProvider>
          </Lenis>
        </CursorProvider>

        <GSAPRuntime />
        <PortalRoot id={PORTAL_IDS.bodyBottom} />
      </body>
    </html>
  );
}
