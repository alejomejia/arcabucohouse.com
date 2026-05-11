import Script from "next/script";

import { isProd } from "@/lib/utils/config";

const UMAMI_SRC = "https://cloud.umami.is/script.js";

/**
 * Loads the Umami tracking script in production only.
 * Renders nothing if `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is absent.
 */
export function UmamiScript() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!isProd || !websiteId) return null;

  return (
    <Script
      src={UMAMI_SRC}
      strategy="afterInteractive"
      data-website-id={websiteId}
    />
  );
}
