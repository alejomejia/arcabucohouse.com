export default {
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true
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
