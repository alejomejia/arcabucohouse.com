import Script from "next/script";

import { config, isProd } from "@/lib/utils/config";

const UMAMI_SRC = "https://cloud.umami.is/script.js";

/**
 * Loads the Umami tracking script in production only.
 * Renders nothing if `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is absent.
 */
export function UmamiScript() {
  if (!isProd || !config.umamiWebsiteId) return null;

  return (
    <Script
      src={UMAMI_SRC}
      strategy="afterInteractive"
      data-website-id={config.umamiWebsiteId}
    />
  );
}
