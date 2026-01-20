import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    useCache: true,
    cacheLife: {
      noStore: {
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
