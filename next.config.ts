import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    useCache: true,
    cacheLife: {
      // Shopify catalog cache profile (products and collections)
      // Cached indefinitely until webhook revalidation from Shopify
      // - stale: 5 minutes - allows serving slightly stale content briefly
      // - revalidate: 7 days - fallback check (webhooks trigger immediate revalidation)
      // - expire: 1 year - maximum time before forcing a refresh (essentially "always" until webhook invalidates)
      shopify: {
        stale: 60 * 5, // 5 minutes
        revalidate: 60 * 60 * 24 * 7, // 7 days (fallback, webhooks handle real-time updates)
        expire: 60 * 60 * 24 * 365, // 1 year (cached until webhook revalidation)
      },
      // No cache profile for data that should not be cached (e.g., cart)
      // All values set to 0 to prevent any caching behavior
      noCache: {
        stale: 0,
        revalidate: 0,
        expire: 0,
      },
    }
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        /* Specific to the shopify store to avoid requests to external domains */
        pathname: '/s/files/1/0723/4578/0420/**'
      }
    ]
  }
};

export default nextConfig;
